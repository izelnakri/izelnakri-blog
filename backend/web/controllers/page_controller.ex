defmodule Backend.PageController do
  use Backend.Web, :controller

  def index(conn, _params) do
    json conn, %{
      name: "izelnakri.com",
      version: "0.0.1"
    }
  end
end
