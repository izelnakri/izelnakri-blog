defmodule Backend.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :password_digest, :string
      add :authentication_token, :string
      add :is_admin, :boolean, default: false, null: false
      add :email, :string, null: false

      timestamps()
    end

  end
end
