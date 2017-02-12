defmodule Backend.UserAuthentication do
  import Plug.Conn

  alias Backend.User

  def init(options), do: options

  def call(conn, _opts) do
    authentication_token = parse_authentication_token(conn)

    if !authentication_token do
      login_error(conn)
    else
      case Repo.get_by(User, authentication_token: authentication_token) do
        nil -> login_error(conn)
        user -> assign(conn, :current_user, user)
      end
    end
  end

  def parse_authentication_token(conn) do
    if List.keyfind(conn.req_headers, "authorization", 0) do
      List.keyfind(conn.req_headers, "authorization", 0) |> elem(1) |> String.slice(7..-1)
    end
  end

  def login_error(conn) do
    encoder = Application.get_env(:phoenix, :format_encoders) |> Keyword.get(:json, Poison)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(401, encoder.encode_to_iodata!(%{errors: %{}}))
    |> halt
  end
end
