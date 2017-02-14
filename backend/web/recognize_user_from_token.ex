defmodule Backend.RecognizeUserFromToken do
  import Plug.Conn
  import Ecto.Query

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

  def parse_authentication_token(conn) do
    if List.keyfind(conn.req_headers, "authorization", 0) do
      List.keyfind(conn.req_headers, "authorization", 0) |> elem(1) |> String.slice(7..-1)
    end
  end
end
