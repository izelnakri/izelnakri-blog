defmodule Backend.User do
  use Backend.Web, :model

  alias Backend.Email
  alias Backend.Person
  alias Ecto.Multi
  alias Comeonin.Bcrypt

  schema "users" do
    field :password, :string, virtual: true
    field :password_digest, :string

    field :authentication_token, :string
    field :is_verified, :boolean, default: false, read_after_writes: true

    field :reset_password_token, :string
    field :reset_password_sent_at, :utc_datetime

    field :locale, :string, default: "en", read_after_writes: true

    field :last_login_at, :utc_datetime
    field :last_login_user_agent, :string
    field :last_login_ip, :string
    field :last_login_type, :string

    field :is_admin, :boolean, default: false

    belongs_to :person, Backend.Person
    belongs_to :primary_email, Backend.Email
    belongs_to :first_version, PaperTrail.Version
    belongs_to :current_version, PaperTrail.Version, on_replace: :update

    has_many :blog_posts, Backend.BlogPost
    has_many :comments, through: [:person, :comments]
    has_many :emails, through: [:person, :emails]

    timestamps()
  end

  def query(_query \\ %{}) do
    from(
      user in __MODULE__,
      left_join: person in assoc(user, :person),
      join: primary_email in assoc(user, :primary_email),
      left_join: emails in assoc(person, :emails),
      preload: [
        primary_email: primary_email,
        person: {person, [emails: emails]}
      ]
    )
  end

  def authentication_serializer(user) do
    user |> Map.delete(:password_digest) |> serialize() |> Map.merge(%{
      person: Person.authentication_serializer(user.person),
      primaryEmail: serialize(user.primary_email)
    })
  end

  def serializer(user) do # remove email addresses here
    user |> Map.delete(:password_digest) |> serialize() |> Map.merge(%{
      person: Person.serializer(user.person)
    })
  end

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_required([:authentication_token, :person_id, :primary_email_id])
    |> unique_constraint(:person_id)
    |> unique_constraint(:primary_email_id)
    |> foreign_key_constraint(:person_id)
    |> foreign_key_constraint(:primary_email_id)
  end

  def registration_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:person_id, :primary_email_id])
    |> password_changeset(params)
    |> login_changeset(params)
    |> changeset(params)
  end

  def login_changeset(struct, params \\ :empty) do
    cast(struct, params, [:last_login_user_agent, :last_login_ip, :last_login_type])
    |> change(%{last_login_at: DateTime.utc_now()})
  end

  def password_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:password])
    |> validate_required([:password])
    |> validate_length(:password, min: 6)
    |> generate_password_digest()
    |> generate_authentication_token()
  end

  def register(params = %{email: email}) do
    found_email = Email.query() |> where(address: ^email) |> Repo.one
    result = Multi.new()
      |> Multi.run(:person, fn %{} ->
        cond do
          found_email && found_email.person ->
            Person.changeset(found_email.person, params)
            |> PaperTrail.update(origin: "password_registration") |> hide_version()
          true ->
            Person.changeset(%Person{}, params)
            |> PaperTrail.insert(origin: "password_registration") |> hide_version()
        end
      end)
      |> Multi.run(:email, fn %{person: person} ->
        email_params = Map.merge(params, %{person_id: person.id, address: email})
        cond do
          is_nil(found_email)->
            new_email = %Email{person_id: person.id} |> Repo.preload(:person)
            Email.user_registration_changeset(new_email, email_params)
            |> PaperTrail.insert(origin: "password_registration") |> hide_version()
          found_email.person && !is_nil(found_email.person.user) ->
            Email.user_registration_changeset(found_email, email_params)
            |> PaperTrail.insert(origin: "password_registration") |> hide_version()
          true ->
            Email.with_person_creation_changeset(found_email, email_params)
            |> PaperTrail.update(origin: "password_registration") |> hide_version()
        end
      end)
      |> Multi.run(:user, fn %{person: person, email: email} ->
        user_params = Map.merge(params, %{person_id: person.id, primary_email_id: email.id})
        registration_changeset(%__MODULE__{}, user_params)
        |> PaperTrail.insert(origin: "password_registration") |> hide_version()
      end)
      |> Repo.transaction()

    case result do
      {:ok, map} -> query() |> where(id: ^map.user.id) |> Repo.one
      changeset -> changeset |> elem(2)
    end
  end

  def login(%{email: email, password: password}) when is_nil(email) or is_nil(password), do: nil
  def login(%{email: email, password: password}) when email == "" or password == "", do: nil
  def login(params = %{email: email, password: password}) do
    user = query() |> where([user, person, email], email.address == ^email) |> Repo.one()
    if user && Bcrypt.checkpw(password, user.password_digest) do
      login_changeset(user, params) |> Repo.update!
    end
  end

  def make_admin(user, options) do
    result = Repo.transaction(fn ->
      confirm_emails(user, options)
      change(user, %{is_admin: true, is_verified: true}) |> PaperTrail.update!(options)
    end)

    case result do
      {:ok, user} -> query() |> where(id: ^user.id) |> Repo.one()
      changeset -> changeset |> elem(2)
    end
  end

  def generate_authentication_token(changeset) do
    changeset
    |> change(%{authentication_token: random_string(64)})
  end

  defp generate_password_digest(changeset = %{changes: %{password: password}}) do
    changeset
    |> change(%{password_digest: Bcrypt.hashpwsalt(password), password: nil})
  end
  defp generate_password_digest(changeset), do: changeset

  defp confirm_emails(user, options \\ []) do
    Repo.transaction(fn ->
      emails = Email |> where(person_id: ^user.person_id) |> Repo.all
      Enum.map(emails, fn(email) -> Email.confirm(email, options) end)
    end) |> elem(1)
  end

  defp hide_version({:error, changeset}), do: {:error, changeset}
  defp hide_version({:ok, %{model: model, version: _version}}), do: {:ok, model}
end
