defmodule Backend.UserController do
  use Backend.Web, :controller

  plug Backend.Plugs.UserAuthentication when action in [:show]

  alias Backend.User

  def login(conn, %{"email" => email, "password" => password}) do
    case User.login(%{email: email, password: password}) do
      nil -> login_error(conn)
      user -> json(conn, %{user: User.authentication_serializer(user)})
    end
  end

  def show(conn, _params) do
    json(conn, %{user: User.authentication_serializer(conn.assigns.current_user)})
  end

  def login_error(conn) do
    encoder = Application.get_env(:phoenix, :format_encoders) |> Keyword.get(:json, Poison)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(401, encoder.encode_to_iodata!(%{errors: %{}}))
  end
end
