defmodule Backend.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :is_admin, :boolean, default: false, null: false
      add :confirmed_at, :utc_datetime
      add :password_digest, :string
      add :authentication_token, :string

      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:authentication_token])
  end
end
