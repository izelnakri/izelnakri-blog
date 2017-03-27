defmodule Backend.BlogPostTag do
  use Backend.Web, :model

  schema "blog_post_tags" do
    belongs_to :tag, Backend.Tag
    belongs_to :blog_post, Backend.BlogPost

    timestamps(updated_at: false)
  end

  def create_changeset(struct, params) do
    struct
    |> cast(params, [:tag_id, :blog_post_id])
    |> validate_required([:tag_id, :blog_post_id])
    |> unique_constraint([:tag_id, :blog_post_id], name: "cannot_duplicate_blog_post_tag")
    |> foreign_key_constraint(:tag_id)
    |> foreign_key_constraint(:blog_post_id)
  end
end
