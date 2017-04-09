defmodule Backend.BlogPost do
  use Backend.Web, :model

  alias Backend.User
  alias Backend.Tag

  schema "blog_posts" do
    field :title, :string
    field :markdown_content, :string
    field :slug, :string

    field :meta_title, :string
    field :meta_description, :string
    field :image_url, :string
    field :published_at, Ecto.DateTime

    belongs_to :user, Backend.User, on_replace: :update
    belongs_to :first_version, PaperTrail.Version
    belongs_to :current_version, PaperTrail.Version, on_replace: :update

    has_one :person, through: [:user, :person]

    has_many :comments, Backend.Comment

    many_to_many :tags, Backend.Tag, join_through: "blog_posts_tags"

    timestamps()
  end

  def query(_params \\ %{}) do
    from(
      blog_post in __MODULE__,
      left_join: comments in assoc(blog_post, :comments),
      join: user in assoc(blog_post, :user),
      join: person in assoc(user, :person),
      join: tags in assoc(blog_post, :tags),
      join: emails in assoc(user, :emails),
      preload: [
        comments: comments,
        tags: tags,
        user: {user, emails: emails, person: person}
      ]
    )
  end

  def serializer(blog_post) do
    serialize(blog_post) |> Map.merge(%{
      tags: Enum.map(blog_post.tags, fn(tag) -> serialize(tag) end),
      comments: Enum.map(blog_post.comments, fn(comment) -> serialize(comment) end),
      user: User.serializer(blog_post.user)
    })
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [
      :title, :markdown_content, :slug, :published_at, :meta_description, :meta_title
    ])
    |> validate_required([
      :title, :markdown_content, :slug, :user_id, :meta_description, :meta_title
    ])
    |> foreign_key_constraint(:user_id)
    |> tag_changeset(params)
  end

  def tag_changeset(changeset, params) do
    if !Map.get(params, "tags") || !is_list(params["tags"]) || params["tags"] == [] do
      add_error(changeset, :tags, "must exist")
    else
      changeset
    end
  end

  def creation_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:user_id])
    |> changeset(params)
  end

  def create(params, options) do
    target_params = params |> Map.merge(%{"user_id" => options[:user].id})
    changeset = creation_changeset(%__MODULE__{}, target_params)

    Repo.transaction(fn ->
      case PaperTrail.insert(changeset, options) do
        {:ok, %{model: blog_post}} ->
          target_blog_post = blog_post |> Repo.preload(:tags)
          Tag.insert_tags_from_params(target_blog_post, params["tags"], [])
          target_blog_post
        {:error, error_result} -> Repo.rollback(error_result)
      end
    end)
  end

  def update(blog_post, params, options) do
    changeset = changeset(blog_post, params)
    Repo.transaction(fn ->
      case PaperTrail.update(changeset, options) do
        {:ok, %{model: blog_post}} ->
          target_blog_post = blog_post |> Repo.preload(:tags)
          existing_tags = Tag.get_existing_tags_from_params(params["tags"])
          Tag.insert_tags_from_params(target_blog_post, params["tags"], existing_tags)
          Tag.delete_tags_diff_from_params(target_blog_post, params["tags"], existing_tags)
          blog_post
        {:error, error_result} -> Repo.rollback(error_result)
      end
    end)
  end

  def delete!(blog_post, options) do
    Repo.transaction(fn ->
      target_blog_post = blog_post |> Repo.preload(:tags)
      target_tag_ids = Enum.map(target_blog_post.tags, fn(tag) -> tag.id end)
      Tag.delete_tags_from_blog_post(target_blog_post, target_tag_ids)
      PaperTrail.delete!(blog_post, options)
    end)
  end
end
