defmodule Backend.Person do
  use Backend.Web, :model

  schema "people" do
    field :full_name, :string
    field :description, :string

    belongs_to :first_version, PaperTrail.Version
    belongs_to :current_version, PaperTrail.Version, on_replace: :update

    has_one :user, Backend.User

    has_many :emails, Backend.Email
    has_many :comments, through: [:emails, :comments]

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:full_name])
    |> validate_required([:full_name])
  end

  def with_user_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:description])
    |> changeset(params)
  end

  def authentication_serializer(person) do
    serializer(person) |> Map.merge(%{
      emails: Enum.map(person.emails, fn(email) -> serialize(email) end)
    })
  end

  def serializer(nil), do: nil
  def serializer(person), do: serialize(person)
end
