require IEx
defmodule Backend.User do
  use Backend.Web, :model

  schema "users" do
    field :email, :string
    field :is_admin, :boolean, default: false
    field :password, :string, virtual: true
    field :password_digest, :string
    field :authentication_token, :string

    has_many :blog_posts, Backend.BlogPost
    has_many :comments, Backend.Comment

    timestamps()
  end

  def serializer(user) do
    serialize(user) |> Map.drop([:password_digest])
  end

  def registration_changeset(struct, params \\ %{}) do
    struct
    |> password_changeset(params)
    |> cast(params, [:email])
    |> validate_required([:email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def password_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:password])
    |> validate_required([:password])
    |> validate_length(:password, min: 6)
    |> generate_password_digest()
    |> generate_authentication_token()
  end

  def admin_changeset(struct, params \\ %{}) do
    struct
    |> registration_changeset(params)
    |> cast(params, [:is_admin])
  end

  def generate_authentication_token(user = %Backend.User{}) do
    params = %{authentication_token: Backend.Utils.random_string(64)}
    user |> cast(params, [:authentication_token]) |> Repo.update!
  end

  def generate_authentication_token(changeset) do
    changeset
    |> put_change(:authentication_token, Backend.Utils.random_string(64))
  end

  defp generate_password_digest(changeset = %{changes: %{password: password}}) do
    changeset
    |> put_change(:password_digest, Comeonin.Bcrypt.hashpwsalt(password))
    |> put_change(:password, nil)
  end

  defp generate_password_digest(changeset), do: changeset

end
