defmodule Backend.Tag do
  use Backend.Web, :model

  alias Backend.BlogPostTag

  schema "tags" do
    field :name, :string

    has_many :blog_post_tags, Backend.BlogPostTag

    many_to_many :blog_posts, Backend.BlogPost, join_through: "blog_posts_tags"

    timestamps()
  end

  def changeset(struct, params) do
    struct
    |> cast(params, [:name])
    |> validate_required(:name)
    |> unique_constraint(:name)
  end

  # Test this method hardcode
  # for optimal use have tags with blog_posts and tag_names_fetched
  # return value?
  def insert_tags_from_params(_blog_post, nil, existing_tags), do: nil
  def insert_tags_from_params(_blog_post, _tag_params_array, nil), do: raise("Existing tags required")
  def insert_tags_from_params(blog_post, tag_params_array, existing_tags) do
    existing_tag_names = existing_tags |> Enum.map(fn(tag) -> tag.name end)
    params_tag_names = tag_params_array |> Enum.map(fn(tag) -> tag["name"] end)
    blog_post_existing_tags = blog_post |> Repo.preload(:tags) |> Map.get(:tags)
    blog_post_existing_tags_names = blog_post_existing_tags |> Enum.map(fn(tag) -> tag.name end)

    Repo.transaction(fn ->
      persist_target_tag_names = (params_tag_names ++ existing_tag_names) |> Enum.uniq
      target_tags = persist_target_tag_names -- blog_post_existing_tags_names |> Enum.map(fn(name) ->
        changeset(%__MODULE__{}, %{"name" => name}) |> Repo.insert!
      end)

      tags_needed_for_blog_tag_insertion = (existing_tags ++ target_tags) -- blog_post_existing_tags
      tags_needed_for_blog_tag_insertion |> Enum.each(fn(target_tag) ->
        BlogPostTag.creation_changeset(%BlogPostTag{}, %{
          "blog_post_id" => blog_post.id, "tag_id" => target_tag.id
        }) |> Repo.insert!
      end)
    end)
  end

  # Test this method hardcode
  # return value?
  def delete_tags_diff_from_params(_blog_post, _tag_params_array, nil), do: raise("Existing tags required")
  def delete_tags_diff_from_params(blog_post, tag_params_array, existing_tags) do
    params_tag_names = tag_params_array |> Enum.map(fn(tag) -> tag["name"] end)
    existing_blog_post_tag_names = blog_post.tags |> Enum.map(fn(tag) -> tag.name end)
    target_tag_names = existing_blog_post_tag_names -- params_tag_names
    target_tag_ids = blog_post.tags |> Enum.filter(fn(tag) ->
      Enum.member?(target_tag_names, tag.name)
    end) |> Enum.map(fn(tag) -> tag.id end)

    delete_tags_from_blog_post(blog_post, target_tag_ids)
  end

  def delete_tags_from_blog_post(blog_post) do
    target_blog_post = blog_post |> Repo.preload(:tags)
    target_tag_ids = Enum.map(target_blog_post.tags, fn(tag) -> tag.id end)
    delete_tags_from_blog_post(target_blog_post, target_tag_ids)
  end
  def delete_tags_from_blog_post(blog_post, target_tag_ids) do
    Repo.transaction(fn ->
      from(
        blog_post_tag in BlogPostTag,
        where: blog_post_tag.tag_id in ^target_tag_ids,
        where: blog_post_tag.blog_post_id == ^blog_post.id
      ) |> Repo.delete_all

      existing_tag_ids = from(
        blog_post_tag in BlogPostTag,
        where: blog_post_tag.tag_id in ^target_tag_ids,
        select: {blog_post_tag.tag_id, count(blog_post_tag.tag_id)},
        group_by: :tag_id
      ) |> Repo.all |> Enum.map(fn(occurance) -> occurance |> elem(0) end)

      tag_ids_to_be_deleted = target_tag_ids -- existing_tag_ids

      from(tag in __MODULE__, where: tag.id in ^tag_ids_to_be_deleted) |> Repo.delete_all
    end)
  end

  def get_existing_tags_from_params(nil), do: [] # this should maybe raises
  def get_existing_tags_from_params(tag_params_array) do
    names = tag_params_array |> Enum.map(fn(tag) -> tag |> Map.get("name") end)
    where(__MODULE__, [tag], tag.name in ^names) |> Repo.all()
  end
end
