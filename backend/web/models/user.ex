defmodule Backend.User do
  use Backend.Web, :model

  schema "users" do
    field :confirmed_at, :utc_datetime
    field :email, :string
    field :is_admin, :boolean, default: false
    field :password, :string, virtual: true
    field :password_digest, :string # cannot be null
    field :authentication_token, :string

    has_many :blog_posts, Backend.BlogPost
    has_many :comments, Backend.Comment

    timestamps()
  end

  def serializer(user) do
    serialize(user) |> Map.drop([:password_digest])
  end

  def confirm(user) do
    user
    |> change(%{confirmed_at: DateTime.utc_now()})
    |> Repo.update!
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:email])
    |> unique_constraint(:email)
    |> validate_required([:email])
    |> validate_format(:email, ~r/@/)
  end

  def password_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:password])
    |> validate_required([:password])
    |> validate_length(:password, min: 6)
    |> generate_password_digest()
    |> generate_authentication_token()
  end

  def registration_changeset(struct, params \\ %{}) do
    struct
    |> changeset(params)
    |> password_changeset(params)
  end

  def admin_registration_changeset(struct, params \\ %{}) do
    struct
    |> registration_changeset(params)
    |> change(%{is_admin: true, confirmed_at: DateTime.utc_now()})
  end

  def generate_authentication_token(user = %Backend.User{}) do
    user
    |> change(%{authentication_token: Backend.Utils.random_string(64)})
    |> Repo.update!
  end

  def generate_authentication_token(changeset) do
    changeset
    |> change(%{authentication_token: Backend.Utils.random_string(64)})
  end

  defp generate_password_digest(changeset = %{changes: %{password: password}}) do
    changeset
    |> change(%{password_digest: Comeonin.Bcrypt.hashpwsalt(password), password: nil})
  end

  defp generate_password_digest(changeset), do: changeset
end
