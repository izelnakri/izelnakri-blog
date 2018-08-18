use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :backend, Backend.Endpoint,
  http: [port: 4000],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :bcrypt_elixir, :log_rounds, 4

# Configure your database
config :backend, Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("PGUSER"),
  password: System.get_env("PGPASSWORD"),
  database: "izelnakri_test",
  hostname: System.get_env("PGHOST"),
  pool: Ecto.Adapters.SQL.Sandbox
