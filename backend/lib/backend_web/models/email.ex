defmodule Backend.Email do
  use Backend.Web, :model

  alias Backend.User

  schema "emails" do
    field :address, :string
    field :confirmed_at, :utc_datetime
    field :confirmation_token, :string
    field :confirmation_token_sent_at, :utc_datetime

    belongs_to :person, Backend.Person
    belongs_to :first_version, PaperTrail.Version
    belongs_to :current_version, PaperTrail.Version, on_replace: :update

    # has_many :comments, Backend.Comment

    has_one :user, through: [:person, :user]

    timestamps()
  end

  def query(_query \\ %{}) do
    from(
      email in __MODULE__,
      left_join: person in assoc(email, :person),
      left_join: user in assoc(person, :user),
      preload: [
        person: {person, [user: user]}
      ]
    )
  end

  def serializer(nil), do: nil
  def serializer(email) do
    serialize(email) |> Map.merge(%{person: serialize(email.person)})
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:address])
    |> validate_required([:address])
    |> validate_format(:address, ~r/@/)
    |> validate_length(:address, max: 75)
    |> unique_constraint(:address)
    |> foreign_key_constraint(:person_id)
  end

  def with_person_changeset(struct, params \\ %{}) do
    struct
    |> changeset(params)
    |> validate_required([:person_id])
  end

  def with_person_creation_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:person_id])
    |> with_person_changeset(params)
  end

  def user_registration_changeset(struct, params \\ %{}) do
    struct
    |> with_person_creation_changeset(params)
    |> generate_confirmation_token()
    |> add_error_if_there_is_a_user_for_the_person()
  end

  defp add_error_if_there_is_a_user_for_the_person(changeset) do
    field = changeset |> fetch_field(:person_id) |> elem(1)

    if field && Repo.get_by(User, person_id: field) do
      add_error(changeset, :user, "already exists")
    else
      changeset
    end
  end

  def generate_confirmation_token(email) do
    email
    |> change(%{
      confirmation_token: random_string(60), confirmation_token_sent_at: utc_now()
    })
  end

  def confirm(email, options \\ [origin: "unknown"]) do
    email
    |> change(%{confirmation_token: nil, confirmed_at: utc_now()})
    |> PaperTrail.update!(options)
  end

  defp utc_now() do
    DateTime.utc_now()
    |> DateTime.truncate(:second)
  end
end
