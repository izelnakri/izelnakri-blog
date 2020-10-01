defmodule Backend.BlogPostControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.BlogPost
  alias Backend.Tag
  alias PaperTrail.Version
  alias Backend.ModelHelpers

  @valid_blog_post_attrs %{
    title: "Testing in Elixir", slug: "testing-in-elixir",
    markdown_content: "It is awesome. Hello World!", meta_title: "Testing in Elixir",
    meta_description: "It is awesome. Click to read more", image_url: nil,
    published_at: nil, tags: [%{name: "Elixir"}]
  }

  @edit_blog_post_attrs %{
    title: "new title", markdown_content: "new content",
    tags: [%{name: "Elixir"}, %{name: "Phoenix"}]
  }

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "POST /blog-post as guest shouldn't work", %{conn: conn} do
    conn = post conn, "/blog-posts", blog_post: @valid_blog_post_attrs

    assert json_response(conn, 401)
    assert BlogPost.count() == 0
  end

  test "POST /blog-post as normal user shouldn't work", %{conn: conn} do
    normal_user = ModelHelpers.insert_normal_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: normal_user})

    conn_with_token = set_conn_with_token(conn, normal_user.authentication_token)
    conn = post(conn_with_token, "/blog-posts", blog_post: blog_post_params)

    assert json_response(conn, 401)
    assert BlogPost.count() == 0
  end

  test "POST /blog-post as admin user should work with tags", %{conn: conn} do
    user = ModelHelpers.insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, comments: nil})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/blog-posts", blog_post: blog_post_params)

    persisted_id = json_response(conn, 201)["blog_post"]["id"]
    assert persisted_id

    blog_post = ModelHelpers.get_blog_post(persisted_id) |> Map.drop([
      :inserted_at, :updated_at, :id, :user, :comments
    ])

    assert blog_post.first_version_id
    assert blog_post.first_version_id == blog_post.current_version_id
    assert @valid_blog_post_attrs |> Map.delete(:tags) == blog_post |> Map.drop([
      :first_version_id, :current_version_id, :user_id, :tags
    ])
    assert blog_post.user_id == user.id
    assert BlogPost.count() == 1
    assert [%{name: "Elixir"}] == blog_post.tags |> Enum.map(fn(tag) -> %{name: tag.name} end)
    assert Tag.count() == 1
  end

  test "POST /blog-posts as admin user shouldnt work without post tag", %{conn: conn} do
    user = ModelHelpers.insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, tags: []})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/blog-posts", blog_post: blog_post_params)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["tags"] |> List.first() == "must exist"

    assert BlogPost.count() == 0
  end

  test "POST /blog-posts cannot work without post title", %{conn: conn} do
    user = ModelHelpers.insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, title: ""})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/blog-posts", blog_post: blog_post_params)

    assert json_response(conn, 422)["errors"]["title"] |> List.first() == "can't be blank"
    assert BlogPost.count() == 0
  end

  test "POST /blog-posts cannot work without post content", %{conn: conn} do
    user = ModelHelpers.insert_admin_user()
    blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user, markdown_content: ""})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params

    assert json_response(conn, 422)["errors"]["markdown_content"] |> List.first() == "can't be blank"
    assert BlogPost.count() == 0
  end

  test "PUT /blog-posts/:id can edit as admin blog post", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post
      |> Map.merge(@edit_blog_post_attrs)
      |> Map.delete(:current_version_id)

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 200)

    persisted_blog_post = ModelHelpers.get_blog_post(blog_post.id)

    assert persisted_blog_post.first_version_id !== persisted_blog_post.current_version_id
    assert Map.drop(persisted_blog_post, [:updated_at, :current_version_id, :tags]) == Map.drop(
      blog_post_params, [:updated_at, :tags]
    )
    assert BlogPost.count() == 1

    assert ["Elixir", "Phoenix"] == persisted_blog_post.tags |> Enum.map(fn(tag) -> tag.name end)
    assert Tag.count() == 2
  end

  # TODO: test tag updating
  test "PUT /blog-posts/:id can edit the tags of blog posts correctly", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post
      |> Map.merge(@edit_blog_post_attrs)
      |> Map.merge(%{tags: [%{name: "Phoenix"}, %{name: "Programming"}, %{name: "Web"}]})
      |> Map.delete(:current_version_id)

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 200)

    persisted_blog_post = ModelHelpers.get_blog_post(blog_post.id)

    assert persisted_blog_post.first_version_id !== persisted_blog_post.current_version_id
    assert Map.drop(persisted_blog_post, [:updated_at, :current_version_id, :tags]) == Map.drop(
      blog_post_params, [:updated_at, :tags]
    )
    assert BlogPost.count() == 1

    assert ["Phoenix", "Programming", "Web"] == persisted_blog_post.tags |> Enum.map(fn(tag) ->
      tag.name
    end)
    assert Tag.count() == 3
  end

  test "PUT /blog-posts/:id normal user cannot edit a blog post", %{conn: conn} do
    user = ModelHelpers.insert_normal_user()
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post |> Map.merge(@edit_blog_post_attrs)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 401)
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id guest cannot edit a blog post", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post |> Map.merge(@edit_blog_post_attrs)

    conn = put(conn, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 401)
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the title to nil", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post |> Map.put(:title, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 422)["errors"]["title"] |> List.first() == "can't be blank"
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the content to nil", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post |> Map.put(:markdown_content, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 422)["errors"]["markdown_content"] |> List.first() == "can't be blank"
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the slug to nil", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    blog_post_params = blog_post |> Map.put(:slug, "")

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    assert json_response(conn, 422)["errors"]["slug"] |> List.first() == "can't be blank"
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "PUT /blog-posts/:id cannot update the tags to nil", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()

    blog_post_params = blog_post |> Map.put(:tags, [])

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = put(conn_with_token, "/blog-posts/#{blog_post.id}", blog_post: blog_post_params)

    persisted_blog_post = ModelHelpers.get_blog_post(blog_post.id)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["tags"] |> List.first() == "must exist"

    assert persisted_blog_post == blog_post
    assert BlogPost.count() == 1
  end

  test "DELETE /blog-posts/:id admin can delete a blog post", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = delete(conn_with_token, "/blog-posts/#{blog_post.id}")

    assert response(conn, 204)
    assert where(BlogPost, id: ^blog_post.id) |> Repo.one == nil
    assert BlogPost.count() == 0
    assert Tag.count() == 0

    delete_version = where(Version, item_id: ^blog_post.id, event: "delete") |> Repo.one()

    assert delete_version.event == "delete"
    assert delete_version.item_changes == blog_post |> Map.drop([:comments, :user, :tags])
    |> Jason.encode! |> Jason.decode!
  end

  test "DELETE /blog-posts/:id normal user cannot delete a blog post", %{conn: conn} do
    user = ModelHelpers.insert_normal_user()
    blog_post = ModelHelpers.insert_blog_post()

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = delete(conn_with_token, "/blog-posts/#{blog_post.id}")

    assert json_response(conn, 401)
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "DELETE /blog-posts/:id guest cannot delete a blog post", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()

    conn = delete(conn, "/blog-posts/#{blog_post.id}")

    assert json_response(conn, 401)
    assert ModelHelpers.get_blog_post(blog_post.id) == blog_post
    assert BlogPost.count() == 1
  end

  test "GET /blog-posts?filter=latest returns last blog posts", %{conn: conn} do
    user = ModelHelpers.insert_normal_user()
    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = get(conn_with_token, "/blog-posts?filter=latest")

    assert json_response(conn, 200)["blog_posts"] == []

    ModelHelpers.insert_blog_post()

    second_conn = get(conn_with_token, "/blog-posts?filter=latest")

    assert json_response(second_conn, 200)["blog_posts"]

    second_conn_result = json_response(second_conn, 200)["blog_posts"]

    assert Enum.count(second_conn_result) == 1
  end

  # test "GET /blog-posts?slug returns the right blog post", %{conn: conn} do
  #
  # end
  #
  # test "GET /blog-posts?slug return 404 when not found", %{conn: conn} do
  #
  # end
end
