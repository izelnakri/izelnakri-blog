use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :backend, Backend.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :info

# Configure your database
config :backend, Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "izelnakri_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox