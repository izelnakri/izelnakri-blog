defmodule Backend.UserAuthentication do
  import Plug.Conn
  import Backend.Utils

  def init(options), do: options

  def call(conn, _opts) do
    authentication_token = parse_authentication_token(conn)

    if !authentication_token do
      not_authorized(conn)
    else
      case conn.assigns.current_user do
        nil -> not_authorized(conn)
        user -> assign(conn, :current_user, user)
      end
    end
  end
end
