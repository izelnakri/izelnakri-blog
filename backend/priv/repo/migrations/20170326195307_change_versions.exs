defmodule Repo.Migrations.ChangeVersions do
  use Ecto.Migration

  def change do
    alter table(:versions) do
      add :originator_id, references(:users)
    end

    create index(:versions, [:originator_id])
  end
end
