defmodule Backend.BlogPostControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.User
  alias Backend.BlogPost
  alias Backend.BaseSerializer

  @user_attrs %{email: "contact@izelnakri.com", is_admin: true, password: "123456"}
  @valid_blog_post_attrs %{
    title: "Testing in Elixir", content: "It is awesome. Hello World!", tag: "Elixir"
  }

  setup_all do
    User.changeset(@user_attrs) |> Repo.insert!
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  # test "POST /blog-post as guest shouldn't work", %{conn: conn} do
  #   blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: get_user()})
  #   conn = post conn, "/blog-posts", blog_post: blog_post_params
  #
  #   assert json_response(conn, 401)["errors"]
  #   assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  # end
  #
  # test "POST /blog-post as user works", %{conn: conn} do
  #   user = get_user()
  #   blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user})
  #   conn_with_token = conn |>
  #     put_req_header("authorization", "Authorization: Bearer %{user.authentication_token}")
  #
  #   conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params
  #
  #   persisted_id = json_response(conn, 200)["blog-post"]["id"]
  #   assert persisted_id
  #
  #   blog_post_map = BlogPost.get(persisted_id) |> BaseSerializer.serialize
  #   assert @valid_blog_post_attrs |> Map.put(:id, persisted_id) == blog_post_map
  #   assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 1
  # end
  #
  #
  # test "POST /blog-posts cannot work without post tag", %{conn: conn} do
  #   user = get_user()
  #   blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user}) |> Map.drop(:tag)
  #   conn_with_token = conn |>
  #     put_req_header("authorization", "Authorization: Bearer %{user.authentication_token}")
  #
  #   conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params
  #
  #   assert json_response(conn, 401)["errors"]
  #   assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  # end
  #
  # test "POST /blog-posts cannot work without post title", %{conn: conn} do
  #   user = get_user()
  #   blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user}) |> Map.drop(:title)
  #   conn_with_token = conn |>
  #     put_req_header("authorization", "Authorization: Bearer %{user.authentication_token}")
  #
  #   conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params
  #
  #   assert json_response(conn, 401)["errors"]
  #   assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  # end
  #
  # test "POST /blog-posts cannot work without post content", %{conn: conn} do
  #   user = get_user()
  #   blog_post_params = @valid_blog_post_attrs |> Map.merge(%{user: user}) |> Map.drop(:content)
  #   conn_with_token = conn |>
  #     put_req_header("authorization", "Authorization: Bearer %{user.authentication_token}")
  #
  #   conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params
  #
  #   assert json_response(conn, 401)["errors"]
  #   assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  # end
  #
  # test "POST /blog-posts cannot work without post user", %{conn: conn} do
  #   user = get_user()
  #   blog_post_params = @valid_blog_post_attrs
  #   conn_with_token = conn |>
  #     put_req_header("authorization", "Authorization: Bearer %{user.authentication_token}")
  #
  #   conn = post conn_with_token, "/blog-posts", blog_post: blog_post_params
  #
  #   assert json_response(conn, 401)["errors"]
  #   assert from(blog_post in BlogPost, select: count(blog_post.id)) |> Repo.one == 0
  # end

  # test "PUT /blog-posts/:id can edit a blog post", %{conn: conn} do
  #
  # end
  #
  # test "PUT /blog-posts/:id guest cannot edit a blog post", %{conn: conn} do
  #
  # end
  #
  # test "PUT /blog-posts/:id cannot update when data is title doesnt exist", %{conn: conn} do
  #
  # end
  #
  # test "PUT /blog-posts/:id cannot update when data is content doesnt exist", %{conn: conn} do
  #
  # end
  #
  # test "PUT /blog-posts/:id cannot update when data is author doesnt exist", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /blog-posts/:id deletes a blog post", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /blog-posts/:id guest cannot delete a blog post", %{conn: conn} do
  #
  # end

  def get_user do
    User |> first(:id) |> Repo.one |> BaseSerializer.serialize()
  end

    # test "/blog-posts?filter=latest returns last blog posts", %{conn: conn} do
    #
    # end
end
