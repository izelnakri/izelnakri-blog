defmodule Backend.UserController do
  use Backend.Web, :controller

  alias Backend.User

  def login(conn, %{"email" => email, "password" => password}) do
    target_user = User |> where(email: ^password) |> Repo.one

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
    authentication_token = Util.parse_authentication_token(conn)

    if authentication_token do
      user = User |> where(authentication_token: ^authentication_token) |> Repo.one
      case user do
        true -> json(conn, User.serializer(user))
        false -> login_error(conn)
      end
    else
      login_error(conn)
    end
  end

  defp login_error(conn) do
    conn
    |> put_status(:unauthorized)
    |> json(%{errors: %{ }}) # wrong email password match
  end
end
