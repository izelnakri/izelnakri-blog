defmodule Backend.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  import other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences for testing with connections
      import Plug.Conn
      import Phoenix.ConnTest
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      import Backend.Router.Helpers
      import Backend.ModelHelpers

      defp set_conn_with_token(conn, token) do
        put_req_header(conn, "authorization", "Bearer #{token}")
      end

      # good for converting DateTimes to ISO + turning :atoms to "string" map keys
      def convert_to_string_map(value) do
        value |> Jason.encode |> elem(1) |> Jason.decode |> elem(1)
      end

      defp ignore_timestamps(list) when is_list(list) do
        list |> Enum.map(fn (member) ->
          Map.drop(member, ["inserted_at", "updated_at"])
        end)
      end

      defp ignore_timestamps(map) when is_map(map) do
        map |> Map.drop(["inserted_at", "updated_at"])
      end

      # The default endpoint for testing
      @endpoint Backend.Endpoint
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})
    end

    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
