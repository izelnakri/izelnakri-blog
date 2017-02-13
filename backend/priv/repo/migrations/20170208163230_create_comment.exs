defmodule Backend.Repo.Migrations.CreateComment do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :content, :text, null: false
      add :confirmed_at, :utc_datetime

      add :email_id, references(:emails, on_delete: :nothing)
      add :blog_post_id, references(:blog_posts, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:comments, [:email_id])
    create index(:comments, [:blog_post_id])
  end
end
