# TODO: Add Tag required validation
defmodule Backend.BlogPost do
  use Backend.Web, :model

  alias Backend.User

  schema "blog_posts" do
    field :title, :string
    field :markdown_content, :string
    field :slug, :string

    field :meta_description, :string
    field :meta_title, :string
    field :image_url, :string
    field :published_at, Ecto.DateTime

    belongs_to :user, Backend.User, on_replace: :update # remove on_replace
    belongs_to :first_version, PaperTrail.Version
    belongs_to :current_version, PaperTrail.Version, on_replace: :update

    has_one :person, through: [:user, :person]

    has_many :tags, Backend.Tag # through blog_post_tags
    has_many :comments, Backend.Comment

    timestamps()
  end

  def query(_params \\ %{}) do
    from(
      blog_post in __MODULE__,
      left_join: comments in assoc(blog_post, :comments),
      join: user in assoc(blog_post, :user),
      join: person in assoc(user, :person),
      join: emails in assoc(user, :emails),
      preload: [
        comments: comments,
        user: {user, emails: emails, person: person}
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
    |> cast(params, [
      :title, :markdown_content, :slug, :published_at, :meta_description, :meta_title
    ])
    |> validate_required([
      :title, :markdown_content, :slug, :user_id, :meta_description, :meta_title
    ])
    |> foreign_key_constraint(:user_id)
  end

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:user_id])
    |> changeset(params)
  end
end
