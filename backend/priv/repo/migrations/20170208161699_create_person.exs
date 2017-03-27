defmodule Backend.Repo.Migrations.CreatePerson do
  use Ecto.Migration

  def change do
    create table(:people) do
      add :full_name, :string, null: false, size: 90
      add :description, :string, size: 250

      add :first_version_id, references(:versions), null: false
      add :current_version_id, references(:versions), null: false

      timestamps()
    end

    create unique_index(:people, [:first_version_id])
    create unique_index(:people, [:current_version_id])
  end
end
