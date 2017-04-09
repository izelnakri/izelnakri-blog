defmodule Backend.BlogPostTag do
  use Backend.Web, :model

  schema "blog_posts_tags" do
    belongs_to :tag, Backend.Tag
    belongs_to :blog_post, Backend.BlogPost

    timestamps(updated_at: false)
  end

  def changeset(struct) do
    struct
    |> validate_required([:tag_id, :blog_post_id])
    |> unique_constraint(:tag_id, name: "cannot_duplicate_blog_post_tag")
    |> foreign_key_constraint(:tag_id)
    |> foreign_key_constraint(:blog_post_id)
  end

  def creation_changeset(struct, params) do
    struct
    |> cast(params, [:tag_id, :blog_post_id])
    |> changeset
  end
end
