defmodule Backend.Utils do
  import Plug.Conn
  
  def random_string(length) do
    :crypto.strong_rand_bytes(length) |> Base.url_encode64 |> binary_part(0, length)
  end

  def parse_request_user_agent(conn) do
    List.keyfind(conn.req_headers, "user-agent", 0) |> elem(1)
  end

  def parse_authentication_token(conn) do
    if List.keyfind(conn.req_headers, "authorization", 0) do
      List.keyfind(conn.req_headers, "authorization", 0) |> elem(1) |> String.slice(6..-1)
    end
  end

  def parse_request_ip(conn) do
    Enum.join(Tuple.to_list(conn.remote_ip), ".")
  end

  def not_authorized(conn) do
    encoder = Application.get_env(:phoenix, :format_encoders) |> Keyword.get(:json, Poison)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(401, encoder.encode_to_iodata!(%{errors: %{}}))
    |> halt
  end
end
