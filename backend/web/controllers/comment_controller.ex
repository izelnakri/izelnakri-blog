defmodule Backend.CommentController do
  use Backend.Web, :controller

  plug Backend.Plugs.UserAuthentication when action in [:update, :delete]

  alias Backend.Comment
  # def index(conn, %{"filter" => "latest"}) do
  #   comments = Comment.query() |> Repo.all
  #
  #   json conn, %{comments: Enum.map(comments, fn(comment) -> Comment.serializer(comment))}
  # end

  def create(conn, %{"comment" => comment_params}) do
    current_user = Map.get(conn.assigns, :current_user)

    case Comment.create(comment_params, current_user) do
      {:ok, %{model: comment}} ->
        conn
        |> put_status(:created)
        |> json(Comment.serializer(comment))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    current_user = Map.get(conn.assigns, :current_user)
    comment = Repo.get!(Comment, id)

    if user_is_comment_owner_or_admin(comment, current_user) do
      changeset = case current_user.is_admin do
        true -> Comment.changeset(comment, comment_params) |> Comment.confirm
        _ -> Comment.changeset(comment, comment_params)
      end

      case PaperTrail.update(changeset, build_metadata(current_user)) do
        {:ok, %{model: comment}} ->
          json(conn, Comment.serializer(comment))
        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(Backend.ChangesetView, "error.json", changeset: changeset)
      end
    else
      not_authorized(conn)
    end
  end

  def delete(conn, %{"id" => id}) do
    current_user = Map.get(conn.assigns, :current_user)
    comment = Repo.get!(Comment, id)

    if user_is_comment_owner_or_admin(comment, current_user) do
      PaperTrail.delete!(comment, build_metadata(current_user))
      send_resp(conn, :no_content, "")
    else
      not_authorized(conn)
    end
  end

  def build_metadata(nil), do: [origin: "public"]
  def build_metadata(user = %{is_admin: true}), do: [origin: "admin", user: user]
  def build_metadata(user), do: [origin: "user", user: user]

  defp user_is_comment_owner_or_admin(comment, user) do
    current_user_is_comment_owner = user.person.emails
      |> Enum.find(fn(email) -> email.id == comment.email_id end)

    current_user_is_comment_owner || user.is_admin
  end
end
