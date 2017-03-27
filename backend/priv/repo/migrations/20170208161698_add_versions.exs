defmodule Repo.Migrations.AddVersions do
  use Ecto.Migration

  def change do
    create table(:versions) do
      add :event,        :string, null: false, size: 10
      add :item_type,    :string, null: false, size: 100
      add :item_id,      :integer
      add :item_changes, :map, null: false
      add :origin,       :string, size: 50, null: false
      add :meta,         :map

      add :inserted_at,  :utc_datetime, null: false
    end

    create index(:versions, [:item_id, :item_type])
    # Uncomment if you want to add the following indexes to speed up special queries:
    # create index(:versions, [:event, :item_type])
    # create index(:versions, [:item_type, :inserted_at])
  end
end
