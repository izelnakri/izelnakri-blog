defmodule Backend.Comment do
  use Backend.Web, :model

  schema "comments" do
    field :content, :string
    field :confirmed, :boolean, default: false

    belongs_to :user, Backend.User
    belongs_to :blog_post, Backend.BlogPost

    timestamps()
  end

  def query(_query) do
    from(
      comment in __MODULE__,
      left_join: user in assoc(comment, :user),
      join: blog_post in assoc(comment, :blog_post),
      preload: [blog_post: blog_post, user: user]
    )
  end

  def serializer(comment) do
    serialize(comment)
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:content, :confirmed])
    |> validate_required([:content, :confirmed])
  end
end
