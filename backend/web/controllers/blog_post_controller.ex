defmodule Backend.BlogPostController do
  use Backend.Web, :controller

  plug Backend.Authentication when action in [:create, :update, :delete]

  alias Backend.BlogPost

  def index(conn, %{"filter" => "latest"}) do
    blog_posts = BlogPost.query() |> Repo.all

    json conn, %{blog_posts: Enum.map(blog_posts, fn(blog_post) ->
      BlogPost.serializer(blog_post)
    end)}
  end

  def index(conn, %{"slug" => slug}) do
    blog_post = BlogPost.query()
      |> where([blog_post], slug: ^slug)
      |> Repo.one

    json conn, BlogPost.serializer(blog_post)
  end

  def create(conn, %{"blog_post" => blog_post_params}) do
    changeset = BlogPost.changeset(%BlogPost{}, blog_post_params)

    case Repo.insert(changeset) do
      {:ok, blog_post} ->
        conn
        |> put_status(:created)
        |> json(BlogPost.serializer(blog_post))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset) # check this
    end
  end

  def update(conn, %{"id" => id, "blog_post" => blog_post_params}) do
    blog_post = Repo.get!(BlogPost, id)
    changeset = BlogPost.changeset(blog_post, blog_post_params)

    case Repo.update(changeset) do
      {:ok, blog_post} ->
        json conn, BlogPost.serializer(blog_post)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Backend.ChangesetView, "error.json", changeset: changeset) # check this
    end
  end

  def delete(conn, %{"id" => id}) do
    blog_post = Repo.get!(BlogPost, id)

    Repo.delete!(blog_post)

    send_resp(conn, :no_content, "")
  end
end
