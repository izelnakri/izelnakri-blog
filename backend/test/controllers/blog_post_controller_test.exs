defmodule Backend.BlogPostControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.User
  alias Backend.BlogPost
  alias Backend.BaseSerializer

  @admin_user_attrs %{email: "contact@izelnakri.com", password: "123456"}
  @normal_user_attrs %{email: "normaluser@gmail.com", password: "123456"}

  @valid_blog_post_attrs %{
    title: "Testing in Elixir", slug: "testing-in-elixir", content: "It is awesome. Hello World!",
    tag: "Elixir"
  }

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "POST /blog-post as guest shouldn't work", %{conn: conn} do
    conn = post conn, "/blog-posts", blog_post: @valid_blog_post_attrs

    assert json_response(conn, 401)
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  end

  test "POST /blog-post as normal user shouldn't work", %{conn: conn} do
    normal_user = insert_normal_user() |> BaseSerializer.serialize()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: normal_user})

    conn = post conn, "/blog-posts", blog_post: blog_post_params

    assert json_response(conn, 401)["errors"]
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  end

  test "POST /blog-post as admin user should work", %{conn: conn} do
    user = insert_admin_user() |> BaseSerializer.serialize()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, comments: []})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    response = json_response(conn, 201)
    persisted_id = response["id"]

    assert persisted_id

    blog_post = BlogPost.query()
      |> where([post], post.id == ^persisted_id)
      |> Repo.one

    blog_post_attrs = blog_post
      |> BaseSerializer.serialize
      |> Map.drop([:inserted_at, :updated_at])

    blog_post_user_attrs = blog_post.user |> BaseSerializer.serialize |> Map.drop([:updated_at])

    assert blog_post_attrs == @valid_blog_post_attrs |> Map.merge(%{id: persisted_id, user_id: user.id})
    assert blog_post_user_attrs == user |> Map.drop([:updated_at])

    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "POST /blog-posts cannot work without post tag", %{conn: conn} do
    user = insert_admin_user() |> BaseSerializer.serialize()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user}) |> Map.delete(:tag)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["tag"] |> List.first() == "can't be blank"

    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  end

  test "POST /blog-posts cannot work without post title", %{conn: conn} do
    user = insert_admin_user() |> BaseSerializer.serialize()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user}) |> Map.delete(:title)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["title"] |> List.first() == "can't be blank"

    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  end

  test "POST /blog-posts cannot work without post content", %{conn: conn} do
    user = insert_admin_user() |> BaseSerializer.serialize()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user}) |> Map.delete(:content)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["content"] |> List.first() == "can't be blank"

    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  end

  test "PUT /blog-posts/:id can edit as admin blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = BlogPost.serializer(blog_post) |> Map.merge(%{
      title: "new title", content: "new content", tag: "Ruby"
    })

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BlogPost.serializer()

    assert json_response(conn, 200)
    assert blog_post |> Map.drop([:updated_at]) == blog_post_params |> Map.drop([:updated_at])
    assert blog_post.updated_at != blog_post_params.updated_at
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "PUT /blog-posts/:id normal user cannot edit a blog post", %{conn: conn} do
    user = insert_normal_user() |> BaseSerializer.serialize()
    blog_post = insert_blog_post() |> BaseSerializer.serialize()

    blog_post_params = blog_post |> Map.merge(%{
      title: "new title", content: "new content", tag: "Ruby"
    })

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    assert json_response(conn, 401)["errors"]
    assert persisted_blog_post == blog_post
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "PUT /blog-posts/:id guest cannot edit a blog post", %{conn: conn} do
    blog_post = insert_blog_post() |> BaseSerializer.serialize()

    blog_post_params = blog_post |> Map.merge(%{
      title: "new title", content: "new content", tag: "Ruby"
    })

    conn = put(conn, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    assert json_response(conn, 401)["errors"]
    assert persisted_blog_post == blog_post
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "PUT /blog-posts/:id cannot update the title to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> BaseSerializer.serialize() |> Map.put(:title, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["title"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post |> BaseSerializer.serialize()
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "PUT /blog-posts/:id cannot update the content to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> BaseSerializer.serialize() |> Map.put(:content, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["content"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post |> BaseSerializer.serialize()
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "PUT /blog-posts/:id cannot update the slug to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> BaseSerializer.serialize() |> Map.put(:slug, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["slug"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post |> BaseSerializer.serialize()
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "PUT /blog-posts/:id cannot update the tag to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> BaseSerializer.serialize() |> Map.put(:tag, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["tag"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post |> BaseSerializer.serialize()
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "DELETE /blog-posts/:id admin can delete a blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = delete(conn_with_token, "/blog-posts/#{blog_post.id}")

    persisted_blog_post = BlogPost |> where([post], post.id == ^blog_post.id) |> Repo.one

    assert response(conn, 204)
    assert persisted_blog_post == nil
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  end

  test "DELETE /blog-posts/:id normal user cannot delete a blog post", %{conn: conn} do
    user = insert_normal_user()
    blog_post = insert_blog_post()

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = delete(conn_with_token, "/blog-posts/#{blog_post.id}")

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    assert json_response(conn, 401)["errors"]
    assert persisted_blog_post == blog_post |> BaseSerializer.serialize()
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  test "DELETE /blog-posts/:id guest cannot delete a blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    conn = delete(conn, "/blog-posts/#{blog_post.id}")

    persisted_blog_post = BlogPost.query()
      |> where([post], post.id == ^blog_post.id)
      |> Repo.one
      |> BaseSerializer.serialize()

    assert json_response(conn, 401)["errors"]
    assert persisted_blog_post == blog_post |> BaseSerializer.serialize()
    assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  end

  defp set_conn_with_token(conn, token), do: put_req_header(conn, "authorization", "Bearer #{token}")

  def insert_admin_user do
    User.admin_registration_changeset(%User{}, @admin_user_attrs) |> Repo.insert!
  end

  def insert_normal_user do
    User.registration_changeset(%User{}, @normal_user_attrs) |> Repo.insert!
  end

  def get_admin_user do
    User |> where(is_admin: true) |> Repo.one |> BaseSerializer.serialize()
  end

  def get_normal_user do
    User |> where(is_admin: false) |> Repo.one |> BaseSerializer.serialize()
  end

  def insert_blog_post() do
    user = insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user})
    blog_post = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    BlogPost.changeset(blog_post, blog_post_params) |> Repo.insert!
  end

  # test "/blog-posts?filter=latest returns last blog posts", %{conn: conn} do
  #
  # end
end
