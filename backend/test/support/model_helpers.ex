defmodule Backend.ModelHelpers do
  alias Backend.User
  alias Backend.BlogPost
  alias Backend.Comment
  alias Backend.BaseSerializer
  import Ecto.Query

  @admin_user_attrs %{email: "contact@izelnakri.com", password: "123456"}
  @normal_user_attrs %{email: "normaluser@gmail.com", password: "123456"}

  @valid_blog_post_attrs %{
    title: "Testing in Elixir", slug: "testing-in-elixir", content: "It is awesome. Hello World!",
    tag: "Elixir"
  }

  def insert_admin_user do
    User.register(@admin_user_attrs)
    |> User.make_admin()
    |> BaseSerializer.serialize()
  end

  def insert_normal_user(params \\ @normal_user_attrs) do
    User.register(params)
    |> BaseSerializer.serialize()
  end

  def insert_blog_post do
    user = insert_admin_user()
    blog_post = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    BlogPost.changeset(blog_post, @valid_blog_post_attrs)
    |> Repo.insert!
    |> BlogPost.serializer()
  end

  def get_blog_post(id) do
    BlogPost.query()
    |> where(id: ^id)
    |> Repo.one
    |> BlogPost.serializer()
  end

  def get_comment(id) do
    Comment.query()
    |> where(id: ^id)
    |> Repo.one
    |> Comment.serializer()
  end
end
