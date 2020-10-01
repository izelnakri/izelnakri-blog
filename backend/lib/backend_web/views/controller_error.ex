defmodule Backend.ControllerError do
  # use Backend.Web, :view
  alias Backend.ErrorHelpers
  import Phoenix.Controller, only: [json: 2]

  @doc """
  Traverses and translates changeset errors.

  See `Ecto.Changeset.traverse_errors/2` and
  `Backend.ErrorHelpers.translate_error/1` for more details.
  """
  def translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)
  end

  def render(conn, changeset: changeset) do
    # When encoded, the changeset returns its errors
    # as a JSON object. So we just pass it forward.

    json(conn, %{errors: translate_errors(changeset)})
  end
end

#{"errors":{"title":["can't be blank"],"tag":["can't be blank"],"slug":["can't be blank"],"content":["can't be blank"]}}

# {
#   "detail": "Some generic non property error message",
#   "source": {
#     "pointer": "data"
#   }
# }
