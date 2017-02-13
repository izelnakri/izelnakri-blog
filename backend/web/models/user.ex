defmodule Backend.User do
  use Backend.Web, :model

  alias Backend.Email
  alias Ecto.Multi

  schema "users" do
    field :is_admin, :boolean, default: false
    field :password, :string, virtual: true
    field :password_digest, :string
    field :authentication_token, :string

    has_many :blog_posts, Backend.BlogPost
    has_many :comments, Backend.Comment
    has_many :emails, Backend.Email

    timestamps()
  end

  def query(_query) do
    from(
      user in __MODULE__,
      join: emails in assoc(user, :emails),
      preload: [emails: emails]
    )
  end

  def serializer(user) do
    serialize(user) |> Map.drop([:password_digest])
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([:authentication_token])
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
    result = Multi.new
      |> Multi.insert(:user, registration_changeset(%Backend.User{}, params))
      |> Multi.run(:email, fn %{user: user} ->
        email_struct = %Email{user_id: user.id} |> Repo.preload(:user)
        Email.with_user_changeset(email_struct, %{"address" => email}) |> Repo.insert
      end)
      |> Repo.transaction()

    case result do
      {:ok, map} -> map |> Map.get(:user) |> Repo.preload(:emails)
      changeset -> changeset |> elem(2)
    end
  end

  def make_admin(user) do
    result = Multi.new
      |> Multi.run(:emails, fn %{} -> confirm_emails(user) end)
      |> Multi.update(:user, change(user, is_admin: true))
      |> Repo.transaction()

    case result do
      {:ok, _map} -> Repo.get!(__MODULE__, user.id) |> Repo.preload(:emails)
      changeset -> changeset |> elem(2)
    end
  end

  def registration_changeset(struct, params \\ %{}) do
    struct
    |> password_changeset(params)
    |> changeset(params)
  end

  def generate_authentication_token(user = %Backend.User{}) do
    user
    |> change(%{authentication_token: Backend.Utils.random_string(64)})
    |> Repo.update!
  end

  def generate_authentication_token(changeset) do
    changeset
    |> change(%{authentication_token: Backend.Utils.random_string(64)})
  end

  defp generate_password_digest(changeset = %{changes: %{password: password}}) do
    changeset
    |> change(%{password_digest: Comeonin.Bcrypt.hashpwsalt(password), password: nil})
  end

  defp generate_password_digest(changeset), do: changeset

  defp confirm_emails(user) do
    emails = Email.query() |> where(user_id: ^user.id) |> Repo.all
    Repo.transaction(fn -> Enum.map(emails, fn(email) -> Email.confirm(email) end) end)
  end
end
