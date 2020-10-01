defmodule Backend.Repo.Migrations.CreateEmail do
  use Ecto.Migration

  def change do
    create table(:emails) do
      add :address, :string, null: false, size: 60
      add :confirmed_at, :utc_datetime
      add :confirmation_token, :string, size: 60
      add :confirmation_token_sent_at, :utc_datetime

      add :person_id, references(:people)
      add :first_version_id, references(:versions), null: false
      add :current_version_id, references(:versions), null: false

      timestamps()
    end

    create unique_index(:emails, [:address])
    create unique_index(:emails, [:first_version_id])
    create unique_index(:emails, [:current_version_id])

    create index(:emails, [:person_id])
  end
end
