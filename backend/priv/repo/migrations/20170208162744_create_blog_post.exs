defmodule Backend.Repo.Migrations.CreateBlogPost do
  use Ecto.Migration

  def change do
    create table(:blog_posts) do
      add :title, :string, null: false, size: 71
      add :markdown_content, :text, null: false
      add :slug, :string, null: false, size: 100
      add :image_url, :string
      add :published_at, :utc_datetime

      add :meta_title, :string, null: false, size: 71
      add :meta_description, :string, null: false, size: 100

      add :user_id, references(:users), null: false
      add :first_version_id, references(:versions), null: false
      add :current_version_id, references(:versions), null: false

      # has_many tags

      timestamps()
    end

    create unique_index(:blog_posts, [:slug])
    create unique_index(
      :blog_posts, [:title, :markdown_content], name: "cannot_duplicate_blog_post"
    )
    create unique_index(:blog_posts, [:first_version_id])
    create unique_index(:blog_posts, [:current_version_id])

    create index(:blog_posts, [:user_id])
    create index(:blog_posts, [:published_at])
  end
end
