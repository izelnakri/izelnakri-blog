defmodule Backend.CommentController do
  use Backend.Web, :controller

  plug Backend.UserAuthentication when action in [:update, :delete]

  alias Backend.Comment
  # def index(conn, %{"filter" => "latest"}) do
  #   comments = Comment.query() |> Repo.all
  #
  #   json conn, %{comments: Enum.map(comments, fn(comment) -> Comment.serializer(comment))}
  # end

  def create(conn, %{"comment" => comment_params}) do
    current_user = Map.get(conn.assigns, :current_user)

    email_id = case current_user do
      nil -> comment_params["email_id"]
      current_user -> current_user.primary_email.id
    end

    confirmed_at = case current_user do
      nil -> nil
      _ -> DateTime.utc_now()
    end

    comment_struct = %Comment{
      blog_post_id: comment_params["blog_post_id"], email_id: email_id, confirmed_at: confirmed_at
    } |> Repo.preload([:blog_post, :email])

    changeset = Comment.changeset(comment_struct, comment_params)

    case PaperTrail.insert(changeset, origin: "blog_post") do
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
    comment = Repo.get!(Comment, id)

    if user_is_comment_owner_or_admin(comment, conn.assigns.current_user) do
      changeset = Comment.user_changeset(comment, comment_params)

      case PaperTrail.update(changeset, origin: "admin_panel") do
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
    comment = Repo.get!(Comment, id)

    if user_is_comment_owner_or_admin(comment, conn.assigns.current_user) do
      # get the origin from whether user or admin
      PaperTrail.delete!(comment, origin: "unknown")

      send_resp(conn, :no_content, "")
    else
      not_authorized(conn)
    end
  end

  defp user_is_comment_owner_or_admin(comment, user) do
    current_user_is_comment_owner = user.person.emails
      |> Enum.find(fn(email) -> email.id == comment.email_id end)

    current_user_is_comment_owner || user.is_admin
  end
end
