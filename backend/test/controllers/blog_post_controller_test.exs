defmodule Backend.BlogPostControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.BlogPost

  import Backend.Utils

  @valid_blog_post_attrs %{
    title: "Testing in Elixir", slug: "testing-in-elixir",
    markdown_content: "It is awesome. Hello World!", meta_title: "Testing in Elixir",
    meta_description: "It is awesome. Click to read more", image_url: nil,
    published_at: nil
  } # add tag: "Elixir"

  @edit_blog_post_attrs %{title: "new title", markdown_content: "new content"}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "POST /blog-post as guest shouldn't work", %{conn: conn} do
    conn = post conn, "/blog-posts", blog_post: @valid_blog_post_attrs

    assert json_response(conn, 401)
    assert BlogPost.count() == 0
  end

  test "POST /blog-post as normal user shouldn't work", %{conn: conn} do
    normal_user = insert_normal_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: normal_user})

    conn = post(conn, "/blog-posts", blog_post: blog_post_params)

    assert json_response(conn, 401)
    assert BlogPost.count() == 0
  end

  test "POST /blog-post as admin user should work", %{conn: conn} do
    user = insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, comments: nil})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/blog-posts", blog_post: blog_post_params)

    persisted_id = json_response(conn, 201)["blog_post"]["id"]
    assert persisted_id

    blog_post = get_blog_post(persisted_id) |> Map.drop([:updated_at])

    blog_post_attrs = blog_post |> serialize() |> Map.drop([:inserted_at, :id])

    assert blog_post_attrs |> Map.delete(:user_id) == @valid_blog_post_attrs
    assert blog_post.user_id == user.id

    assert BlogPost.count() == 1
  end

  # test "POST /blog-posts cannot work without post tag", %{conn: conn} do
  #   user = insert_admin_user()
  #   blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, tag: ""})
  #
  #   conn_with_token = set_conn_with_token(conn, user.authentication_token)
  #   conn = post(conn_with_token, "/blog-posts", blog_post: blog_post_params)
  #
  #   response = json_response(conn, 422)
  #   assert response
  #   assert response["errors"]["tag"] |> List.first() == "can't be blank"
  #
  #   assert BlogPost.count() == 0
  # end

  test "POST /blog-posts cannot work without post title", %{conn: conn} do
    user = insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, title: ""})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["title"] |> List.first() == "can't be blank"

    assert BlogPost.count() == 0
  end

  test "POST /blog-posts cannot work without post content", %{conn: conn} do
    user = insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, markdown_content: ""})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["markdown_content"] |> List.first() == "can't be blank"

    assert BlogPost.count() == 0
  end

  test "PUT /blog-posts/:id can edit as admin blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> Map.merge(@edit_blog_post_attrs)

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = get_blog_post(blog_post.id)

    assert json_response(conn, 200)
    assert persisted_blog_post |> Map.drop([:updated_at]) == blog_post_params |> Map.drop([:updated_at])
    assert persisted_blog_post.updated_at != blog_post_params.updated_at
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id normal user cannot edit a blog post", %{conn: conn} do
    user = insert_normal_user()
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> Map.merge(@edit_blog_post_attrs)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = get_blog_post(blog_post.id)

    assert json_response(conn, 401)
    assert persisted_blog_post == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id guest cannot edit a blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> Map.merge(@edit_blog_post_attrs)

    conn = put(conn, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = get_blog_post(blog_post.id)

    assert json_response(conn, 401)
    assert persisted_blog_post == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the title to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> Map.put(:title, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = get_blog_post(blog_post.id)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["title"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the content to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> Map.put(:markdown_content, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = get_blog_post(blog_post.id)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["markdown_content"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the slug to nil", %{conn: conn} do
    blog_post = insert_blog_post()

    blog_post_params = blog_post |> Map.put(:slug, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = get_blog_post(blog_post.id)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["slug"] |> List.first() == "can't be blank"

    assert persisted_blog_post == blog_post
    assert BlogPost.count() == 1
  end

  # test "PUT /blog-posts/:id cannot update the tag to nil", %{conn: conn} do
  #   blog_post = insert_blog_post()
  #
  #   blog_post_params = blog_post |> Map.put(:tag, "")
  #
  #   conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
  #   conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)
  #
  #   persisted_blog_post = get_blog_post(blog_post.id)
  #
  #   response = json_response(conn, 422)
  #   assert response
  #   assert response["errors"]["tag"] |> List.first() == "can't be blank"
  #
  #   assert persisted_blog_post == blog_post
  #   assert BlogPost.count() == 1
  # end

  test "DELETE /blog-posts/:id admin can delete a blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = delete(conn_with_token, "/blog-posts/#{blog_post.id}")

    persisted_blog_post = where(BlogPost, id: ^blog_post.id) |> Repo.one

    assert response(conn, 204)
    assert persisted_blog_post == nil
    assert BlogPost.count() == 0
  end

  test "DELETE /blog-posts/:id normal user cannot delete a blog post", %{conn: conn} do
    user = insert_normal_user()
    blog_post = insert_blog_post()

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = delete(conn_with_token, "/blog-posts/#{blog_post.id}")

    assert json_response(conn, 401)["errors"]
    assert get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "DELETE /blog-posts/:id guest cannot delete a blog post", %{conn: conn} do
    blog_post = insert_blog_post()

    conn = delete(conn, "/blog-posts/#{blog_post.id}")

    assert json_response(conn, 401)["errors"]
    assert get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  # test "/blog-posts?filter=latest returns last blog posts", %{conn: conn} do
  #
  # end
end
