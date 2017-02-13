defmodule Backend.Email do
  use Backend.Web, :model

  schema "emails" do
    field :address, :string
    field :confirmed_at, :utc_datetime

    belongs_to :user, Backend.User, on_replace: :update

    has_many :comments, Backend.Comment

    timestamps()
  end

  def query(_query \\ %{}) do
    from(
      email in __MODULE__,
      left_join: user in assoc(email, :user),
      preload: [user: user]
    )
  end

  def with_user_changeset(struct, params \\ %{}) do
    struct
    |> changeset(params)
    |> assoc_constraint(:user)
    |> cast_assoc(:user, required: true)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:address])
    |> unique_constraint(:address)
    |> validate_required([:address])
    |> validate_format(:address, ~r/@/)
  end

  def confirm(email) do
    change(email, %{confirmed_at: DateTime.utc_now()}) |> Repo.update!
  end
end
