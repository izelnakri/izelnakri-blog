defmodule Backend.Repo.Migrations.CreateComment do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :content, :text, null: false
      add :confirmed, :boolean, default: false, null: false

      add :user_id, references(:users, on_delete: :nothing)
      add :blog_post_id, references(:blog_posts, on_delete: :nothing)

      timestamps()
    end

    create index(:comments, [:user_id])
    create index(:comments, [:blog_post_id])
  end
end
