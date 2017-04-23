defmodule Backend.Endpoint do
  use Phoenix.Endpoint, otp_app: :backend

  socket "/socket", Backend.UserSocket

  if Mix.env() !== "prod" do
    plug CORSPlug
  end

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger
  plug Plug.Parsers, parsers: [:multipart, :json], pass: ["*/*"], json_decoder: Poison

  plug Backend.Router
end
