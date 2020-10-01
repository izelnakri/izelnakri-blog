defmodule Backend.Repo.Migrations.CreateComment do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :content, :text, null: false
      add :confirmed_at, :utc_datetime

      add :email_id, references(:emails)
      add :blog_post_id, references(:blog_posts), null: false
      add :first_version_id, references(:versions), null: false
      add :current_version_id, references(:versions), null: false

      timestamps()
    end

    create unique_index(
      :comments, [:content, :email_id, :blog_post_id], name: "cannot_duplicate_comment"
    )

    create index(:comments, [:email_id])
    create index(:comments, [:blog_post_id])
  end
end
