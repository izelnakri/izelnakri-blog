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
      current_user -> current_user.emails |> List.first() |> Map.get(:id)
    end

    confirmed_at = case current_user do
      nil -> nil
      current_user -> DateTime.utc_now()
    end

    comment_struct = %Comment{
      blog_post_id: comment_params["blog_post_id"], email_id: email_id, confirmed_at: confirmed_at
    } |> Repo.preload([:blog_post, :email])

    changeset = Comment.changeset(comment_struct, comment_params)

    case Repo.insert(changeset) do
      {:ok, comment} ->
        conn
        |> put_status(:created)
        |> json(BaseSerializer.serialize(comment))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Repo.get!(Comment, id)
    changeset = Comment.changeset(comment, comment_params)

    case Repo.update(changeset) do
      {:ok, comment} ->
        json(conn, BaseSerializer.serialize(comment))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Repo.get!(Comment, id)

    Repo.delete!(comment)

    send_resp(conn, :no_content, "")
  end
end
