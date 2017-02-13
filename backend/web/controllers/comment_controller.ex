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
    # refactor this:
    changeset = Comment.changeset(%Comment{}, comment_params)

    case Repo.insert(changeset) do
      {:ok, comment} ->
        conn
        |> put_status(:created)
        |> json(Comment.serializer(comment))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset) # check this
    end
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Repo.get!(Comment, id)
    changeset = Comment.changeset(comment, comment_params)

    case Repo.update(changeset) do
      {:ok, comment} ->
        json conn, Comment.serializer(comment)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset) # check this
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Repo.get!(Comment, id)

    Repo.delete!(comment)

    send_resp(conn, :no_content, "")
  end
end