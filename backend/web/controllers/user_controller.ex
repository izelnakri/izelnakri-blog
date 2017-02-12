defmodule Backend.UserController do
  use Backend.Web, :controller

  plug Backend.UserAuthentication when action in [:show]

  alias Backend.User

  def login(conn, %{"email" => email, "password" => password}) do
    target_user = Repo.get_by(User, where: email)

    case target_user && password do
      true ->
        case Comeonin.Bcrypt.checkpw(password, target_user.password) do
          true -> json(conn, User.serializer(target_user))
          false -> login_error(conn)
        end
      false -> login_error(conn)
    end
  end

  def show(conn, _params) do
    json(conn, User.serializer(conn.assigns.current_user))
  end

  def login_error(conn) do
    encoder = Application.get_env(:phoenix, :format_encoders)
      |> Keyword.get(:json, Poison)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(401, encoder.encode_to_iodata!(%{errors: %{}}))
  end
end
