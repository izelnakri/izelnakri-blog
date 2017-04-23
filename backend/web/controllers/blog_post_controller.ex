defmodule Backend.BlogPostController do
  use Backend.Web, :controller

  plug Backend.Plugs.AdminAuthentication when action in [:create, :update, :delete]

  alias Backend.BlogPost

  def index(conn, %{"filter" => "latest"}) do
    blog_posts = BlogPost.query() |> Repo.all

    json conn, %{blog_posts: Enum.map(blog_posts, &BlogPost.serializer(&1))}
  end

  def index(conn, %{"slug" => slug}) do
    blog_post = BlogPost.query() |> where([blog_post], slug: ^slug) |> Repo.one

    json conn, %{blog_post: BlogPost.serializer(blog_post)}
  end

  # def show(conn, %{"id" => id}) do
  #
  # end

  def create(conn, %{"blog_post" => blog_post_params}) do
    case BlogPost.create(blog_post_params, origin: "user", user: conn.assigns.current_user) do
      {:ok, model} ->
        blog_post = BlogPost.query() |> where(id: ^model.id) |> Repo.one()
        conn
        |> put_status(:created)
        |> json(%{blog_post: BlogPost.serializer(blog_post)})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "blog_post" => blog_post_params}) do
    current_user = conn.assigns.current_user
    blog_post = BlogPost.query() |> where([post], post.id == ^id) |> Repo.one

    case BlogPost.update(blog_post, blog_post_params, origin: "user", user: current_user) do
      {:ok, model} ->
        blog_post = BlogPost.query() |> where(id: ^model.id) |> Repo.one()
        json conn, %{blog_post: BlogPost.serializer(blog_post)}
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    blog_post = BlogPost.query() |> where([post], post.id == ^id) |> Repo.one

    BlogPost.delete!(blog_post, origin: "user", user: conn.assigns.current_user)
    send_resp(conn, :no_content, "")
  end
end
