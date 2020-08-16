defmodule Backend.Plugs.RecognizeUserFromToken do
  import Plug.Conn
  import Ecto.Query
  import Backend.Web.ConnUtils

  alias Backend.User

  def init(options), do: options

  def call(conn, _opts) do
    authentication_token = parse_authentication_token(conn)

    if !authentication_token do
      conn
    else
      user = User.query() |> where(authentication_token: ^authentication_token) |> Repo.one
      case user do
        nil -> conn
        user -> assign(conn, :current_user, user)
      end
    end
  end
end
