defmodule Backend.Endpoint do
  use Phoenix.Endpoint, otp_app: :backend

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_new_phx_key",
    signing_salt: "Fk1gPunm"
  ]

  socket "/socket", Backend.UserSocket,
    websocket: true,
    longpoll: false

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]

  if Mix.env() !== :prod do
    plug CORSPlug
  end

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Logger
  plug Plug.Parsers, parsers: [:multipart, :json], pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Backend.Router
end
