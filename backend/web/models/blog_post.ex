defmodule Backend.BlogPost do
  use Backend.Web, :model

  alias Backend.User

  schema "blog_posts" do
    field :title, :string
    field :markdown_content, :string
    field :slug, :string

    # meta_title
    # meta_description
    # image

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
      join: emails in assoc(user, :emails),
      preload: [
        comments: comments,
        user: {user, emails: emails}
      ]
    )
  end

  def serializer(blog_post) do
    serialize(blog_post) |> Map.merge(%{
      # comments: Enum.map(blog_post.comments, fn(comment) -> serialize(comment) end),
      user: User.serializer(blog_post.user)
    })
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :markdown_content, :slug, :tag])
    |> validate_required([:title, :markdown_content, :slug, :tag, :user_id])
    |> foreign_key_constraint(:user_id)
  end
end
