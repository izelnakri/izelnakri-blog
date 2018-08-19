defmodule Backend.Mixfile do
  use Mix.Project

  def project do
    [
      app: :backend,
      version: "0.0.1",
      elixirc_paths: elixirc_paths(Mix.env),
      compilers: [:phoenix, :gettext] ++ Mix.compilers,
      build_embedded: Mix.env == :prod,
      start_permanent: Mix.env == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Backend, []},
      applications: [
        :phoenix, :phoenix_pubsub, :phoenix_html, :cowboy, :logger, :gettext, :phoenix_ecto,
        :postgrex, :comeonin
      ]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      # {:bureaucrat, "~> 0.1.4"},
      {:bcrypt_elixir, "~> 1.0.9"},
      {:cors_plug, "~> 1.5.2", only: [:dev, :test]},
      {:cowboy, "~> 1.0"},
      {:comeonin, "~> 4.1.1"}, # NOTE: upgrade
      {:gettext, "~> 0.11"},
      {:paper_trail, "~> 0.8.0"},
      {:phoenix, "~> 1.3.4"},
      {:phoenix_ecto, "~> 3.2"},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_html, "~> 2.6"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:postgrex, ">= 0.0.0"},
      {:scribe, "~> 0.4.0", only: [:dev]},
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
