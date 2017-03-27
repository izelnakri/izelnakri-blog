defmodule Backend.ModelHelpers do
  alias Backend.BlogPost
  alias Backend.Comment
  alias Backend.Email
  alias Backend.User

  import Ecto.Query

  @admin_user_attrs %{email: "contact@izelnakri.com", password: "123456", full_name: "Izel Nakri"}
  @normal_user_attrs %{email: "normaluser@gmail.com", password: "123456", full_name: "Other Nakri"}

  @valid_blog_post_attrs %{
    title: "Testing in Elixir", slug: "testing-in-elixir",
    markdown_content: "It is awesome. Hello World!", meta_title: "Testing in Elixir",
    meta_description: "It is awesome. Click to read more", image_url: nil,
    published_at: nil
  } # add tags: ["Elixir"]

  @valid_comment_attrs %{
    content: "This is a great blog post!"
  }

  def insert_admin_user(params \\ @admin_user_attrs) do
    User.register(params)
    |> User.make_admin(origin: "test")
    |> User.authentication_serializer()
  end

  def insert_normal_user(params \\ @normal_user_attrs) do
    User.register(params)
    |> User.authentication_serializer()
  end

  def insert_blog_post(params \\ [user: insert_admin_user()]) do
    blog_post_changeset = %BlogPost{user_id: params[:user].id} |> Repo.preload(:user) # emails here maybe

    blog_post = BlogPost.changeset(blog_post_changeset, @valid_blog_post_attrs)
      |> PaperTrail.insert!(origin: "test")

    BlogPost.query()
    |> where(id: ^blog_post.id)
    |> Repo.one()
    |> BlogPost.serializer()
  end

  def insert_comment(params \\ [user: nil]) do
    blog_post = case params[:user] do
      nil -> insert_blog_post()
      user -> insert_blog_post(user: user)
    end

    email_id = case params[:user] do
      nil -> nil
      user -> user.primary_email_id
    end

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
    |> Repo.one()
    |> BlogPost.serializer()
  end

  def get_authenticated_user(id) do
    User.query()
    |> where(id: ^id)
    |> Repo.one()
    |> User.authentication_serializer()
  end

  def get_user(id) do
    User.query()
    |> where(id: ^id)
    |> Repo.one()
    |> User.serializer()
  end

  def get_admin_user do
    User.query()
    |> where(is_admin: true)
    |> Repo.one()
    |> User.serializer()
  end

  def get_email(id) do
    Email.query()
    |> where(id: ^id)
    |> Repo.one()
    |> Email.serializer()
  end

  def get_comment(id) do
    Comment.query()
    |> where(id: ^id)
    |> Repo.one()
    |> Comment.serializer()
  end
end
