defmodule Repo.Migrations.Email do
  use Ecto.Migration

  def change do
    create table(:emails) do
      add :address, :string, null: false
      add :confirmed_at, :utc_datetime

      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:emails, [:user_id])
    create unique_index(:emails, [:address])
  end
end
