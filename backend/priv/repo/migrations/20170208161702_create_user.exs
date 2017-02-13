defmodule Backend.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :is_admin, :boolean, default: false, null: false
      add :password_digest, :string
      add :authentication_token, :string, null: false

      timestamps()
    end

    create unique_index(:users, [:authentication_token])
  end
end
