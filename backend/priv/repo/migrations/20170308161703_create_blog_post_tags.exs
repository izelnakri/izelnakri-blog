defmodule Backend.Repo.Migrations.CreateBlogPostTag do
  use Ecto.Migration

  def change do
    create table(:blog_post_tags) do
      add :tag_id, references(:tags), null: false
      add :blog_post_id, references(:blog_posts), null: false

      add :inserted_at, :utc_datetime, null: false
    end

    create unique_index(
      :blog_post_tags, [:tag_id, :blog_post_id], name: "cannot_duplicate_blog_post_tag"
    )
  end
end
