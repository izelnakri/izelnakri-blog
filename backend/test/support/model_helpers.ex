defmodule Backend.ModelHelpers do
  alias Backend.BlogPost
  alias Backend.Comment
  alias Backend.Email
  alias Backend.User

  alias Backend.BaseSerializer
  import Ecto.Query

  @admin_user_attrs %{email: "contact@izelnakri.com", password: "123456"}
  @normal_user_attrs %{email: "normaluser@gmail.com", password: "123456"}

  @valid_blog_post_attrs %{
    title: "Testing in Elixir", slug: "testing-in-elixir", content: "It is awesome. Hello World!",
    tag: "Elixir"
  }

  @valid_comment_attrs %{
    content: "This is a great blog post!"
  }

  def insert_admin_user do
    User.register(@admin_user_attrs)
    |> User.make_admin()
    |> User.serializer()
  end

  def insert_normal_user(params \\ @normal_user_attrs) do
    User.register(params)
    |> User.serializer()
  end

  def insert_blog_post do
    user = insert_admin_user()
    blog_post_changeset = %BlogPost{user_id: user.id} |> Repo.preload(:user) # emails here maybe

    blog_post = BlogPost.changeset(blog_post_changeset, @valid_blog_post_attrs) |> Repo.insert!
    BlogPost.query()
    |> where(id: ^blog_post.id)
    |> Repo.one()
    |> BlogPost.serializer()
  end

  def insert_comment do
    blog_post = insert_blog_post()
    email_id = blog_post.user.emails |> List.first() |> Map.get(:id)

    comment_changeset = %Comment{blog_post_id: blog_post.id, email_id: email_id}
      |> Repo.preload([:blog_post, :email])

    comment = Comment.changeset(comment_changeset, @valid_comment_attrs) |> Repo.insert!
    Comment.query()
    |> where(id: ^comment.id)
    |> Repo.one()
    |> Comment.serializer()
  end

  def get_blog_post(id) do
    BlogPost.query()
    |> where(id: ^id)
    |> Repo.one
    |> BlogPost.serializer()
  end

  def get_user(id) do
    User.query()
    |> where(id: ^id)
    |> Repo.one
    |> User.serializer()
  end

  def get_email(id) do
    Email.query()
    |> where(id: ^id)
    |> Repo.one
    |> Email.serializer()
  end

  def get_comment(id) do
    Comment.query()
    |> where(id: ^id)
    |> Repo.one
    |> Comment.serializer()
  end
end
