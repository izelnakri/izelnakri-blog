defmodule Backend.Repo.Migrations.CreateBlogPost do
  use Ecto.Migration

  def change do
    create table(:blog_posts) do
      add :title, :string, null: false
      add :content, :text, null: false
      add :slug, :string, null: false
      add :tag, :string, null: false
      
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create unique_index(:blog_posts, [:slug])
    create index(:blog_posts, [:user_id])
  end
end
