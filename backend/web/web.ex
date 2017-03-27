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
      use Phoenix.Controller

      import Ecto
      import Ecto.Query

      import Backend.Router.Helpers
      import Backend.Gettext
      import Backend.Web.ConnUtils
    end
  end

  def view do
    quote do
      use Phoenix.View, root: "web/templates"

      # Import convenience functions from controllers
      import Phoenix.Controller, only: [get_csrf_token: 0, get_flash: 2, view_module: 1]

      # Use all HTML functionality (forms, tags, etc)
      use Phoenix.HTML

      import Backend.Router.Helpers
      import Backend.ErrorHelpers
      import Backend.Gettext
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel

      import Ecto
      import Ecto.Query
      import Backend.Gettext

      import Backend.Authentication
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
