defmodule Backend.BlogPost do
  use Backend.Web, :model

  schema "blog_posts" do
    field :title, :string
    field :content, :string
    field :slug, :string

    field :tag, :string # will go in future

    belongs_to :user, Backend.User, on_replace: :update

    has_many :comments, Backend.Comment

    timestamps()
  end

  def query(_params \\ %{}) do
    from(
      blog_post in __MODULE__,
      left_join: comments in assoc(blog_post, :comments),
      join: user in assoc(blog_post, :user),
      preload: [comments: comments, user: user]
    )
  end

  def serializer(blog_post) do
    serialize(blog_post) |> Map.merge(%{
      # comments: Enum.map(blog_post.comments, fn(comment) -> serialize(comment) end),
      user: serialize(blog_post.user)
    })
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :content, :slug, :tag])
    |> validate_required([:title, :content, :slug, :tag])
    |> cast_assoc(:user, required: true)
    |> assoc_constraint(:user)
  end
end
