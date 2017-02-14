defmodule Backend.AdminAuthentication do
  import Plug.Conn
  import Backend.Utils

  alias Backend.User

  def init(options), do: options

  def call(conn, _opts) do
    authentication_token = parse_authentication_token(conn)

    if !authentication_token || !conn.assigns.current_user do
      not_authorized(conn)
    else
      case conn.assigns.current_user.is_admin do
        true -> assign(conn, :current_user, conn.assigns.current_user)
        _ -> not_authorized(conn)
      end
    end
  end
end
