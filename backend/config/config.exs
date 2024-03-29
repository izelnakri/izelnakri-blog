# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :backend, ecto_repos: [Repo]

# IO.puts("Mix.env is")
# IO.puts(Mix.env())
# IO.puts("PGHOST is")
# pg_host = System.get_env("PGHOST")
# IO.puts(pg_host)
# image = System.get_env("IMAGE")
# IO.puts("IMAGE IS")
# IO.puts(image || "not found")
# Configures the endpoint
config :backend, Backend.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "PlfNeUE3Op1o+O7mN9eoPllD4WELqDaVt83fkR3S8PIZZE264O7O8Ng4nLwJ+s5f",
  render_errors: [view: Backend.ErrorView, accepts: ~w(html json)],
  pubsub_server: Backend.PubSub,
  live_view: [signing_salt: "6P48dApS"]

config :paper_trail, repo: Repo, originator: [name: :user, model: Backend.User], strict_mode: true

# Configures Elixir's Logger
config :logger, :console, format: "$time $metadata[$level] $message\n", metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
