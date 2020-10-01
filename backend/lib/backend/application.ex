defmodule Backend.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Repo,
      # Start the Telemetry supervisor
      Backend.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Backend.PubSub},
      # Start the Endpoint (http/https)
      Backend.Endpoint
      # Start a worker by calling: NewPhx.Worker.start_link(arg)
      # {NewPhx.Worker, arg}
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Backend.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Backend.Endpoint.config_change(changed, removed)
    :ok
  end
end
