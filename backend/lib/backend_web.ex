defmodule Backend.Web do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use Backend.Web, :controller
      use Backend.Web, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  def model do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import Backend.Utils

      def count do
        from(record in __MODULE__, select: count(record.id)) |> Repo.one
      end

      def first do
        from(record in __MODULE__, limit: 1, order_by: [asc: :inserted_at]) |> Repo.one
      end

      def last do
        from(record in __MODULE__, limit: 1, order_by: [desc: :inserted_at]) |> Repo.one
      end
    end
  end

  def controller do
    quote do
      # import Backend.Authentication
      use Phoenix.Controller, namespace: Backend

      import Ecto
      import Ecto.Query

      import Backend.Web.ConnUtils
      import Plug.Conn
      import Backend.Gettext
      alias Backend.Router.Helpers, as: Routes
    end
  end

  def view do
    quote do
      use Phoenix.View,
        root: "lib/backend/templates",
        namespace: Backend

      # Import convenience functions from controllers
      import Phoenix.Controller,
        only: [get_flash: 1, get_flash: 2, view_module: 1, view_template: 1]

      # Include shared imports and aliases for views
      unquote(view_helpers())
    end
  end

  def router do
    quote do
      use Phoenix.Router

      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def channel do
    quote do
      use Phoenix.Channel

      import Backend.Gettext
    end
  end

  defp view_helpers do
    quote do
      # Use all HTML functionality (forms, tags, etc)
      use Phoenix.HTML

      # Import basic rendering functionality (render, render_layout, etc)
      import Phoenix.View

      import Backend.ErrorHelpers
      alias Backend.Router.Helpers, as: Routes
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
