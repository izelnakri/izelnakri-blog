defmodule Backend.User do
  use Backend.Web, :model

  schema "users" do
    field :password_digest, :string
    field :authentication_token, :string
    field :is_admin, :boolean, default: false
    field :email, :string

    has_many :blog_posts, Backend.BlogPost
    has_many :comments, Backend.Comment

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:password_digest, :authentication_token, :is_admin, :email])
    |> validate_required([:password_digest, :authentication_token, :is_admin, :email])
  end

  def serializer(user) do
    serialize(user) |> Map.drop([:password_digest])
  end
end
