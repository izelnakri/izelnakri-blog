defmodule Backend.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :password_digest, :string, size: 80
      add :authentication_token, :string, null: false, size: 64
      add :is_verified, :boolean, default: false

      add :reset_password_token, :string, size: 60
      add :reset_password_sent_at, :utc_datetime

      add :locale, :string, size: 10, default: "en", null: false

      add :last_login_at, :utc_datetime, null: false
      add :last_login_user_agent, :string
      add :last_login_ip, :string, size: 45
      add :last_login_type, :string, size: 25

      add :is_admin, :boolean, default: false, null: false

      add :person_id, references(:people), null: false
      add :primary_email_id, references(:emails), null: false

      add :first_version_id, references(:versions), null: false
      add :current_version_id, references(:versions), null: false

      timestamps()
    end

    create unique_index(:users, [:authentication_token])
    create unique_index(:users, [:reset_password_token])

    create unique_index(:users, [:person_id])
    create unique_index(:users, [:primary_email_id])

    create unique_index(:users, [:first_version_id])
    create unique_index(:users, [:current_version_id])
  end
end
