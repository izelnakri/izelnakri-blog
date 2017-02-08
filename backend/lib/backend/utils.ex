defmodule Backend.Utils do
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
end
