defmodule Backend.BlogPostController do
  use Backend.Web, :controller

  alias Backend.BlogPost

  def index(conn, %{"slug" => slug}) do
    blog_post = BlogPost.query()
      |> where([blog_post], slug: ^slug)
      |> Repo.one

    json conn, BlogPost.serializer(blog_post)
  end
end
