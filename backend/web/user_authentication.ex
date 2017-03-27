defmodule Backend.UserAuthentication do
  import Plug.Conn
  import Backend.Web.ConnUtils

  def init(options), do: options

  def call(conn, _opts) do
    authentication_token = parse_authentication_token(conn)

    case authentication_token do
      nil -> not_authorized(conn)
      "" -> not_authorized(conn)
      authentication_token ->
        case Map.has_key?(conn.assigns, :current_user) do
          true -> conn
          false -> not_authorized(conn)
        end
    end
  end
end
