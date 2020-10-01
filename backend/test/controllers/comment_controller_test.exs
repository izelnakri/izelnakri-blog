defmodule Backend.CommentControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.Comment
  alias Backend.ModelHelpers

  @valid_comment_params %{content: "this is a comment"}
  @edit_comment_params %{content: "Interesting post, edited my comment"}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "POST /comments as guest works", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    comment_params = @valid_comment_params |> Map.merge(%{blog_post_id: blog_post.id})

    conn = post(conn, "/comments", comment: comment_params)
    persisted_id = json_response(conn, 201)["id"]

    assert persisted_id

    comment = get_comment(persisted_id) |> Map.drop([:updated_at])

    assert comment |> Map.take([:content]) == @valid_comment_params
    assert comment.email_id == nil
    assert comment.confirmed_at == nil
    assert comment.blog_post_id == blog_post.id
    assert Comment.count() == 1
  end

  test "POST /comments with an email works", %{conn: conn} do
    # TODO: this test should be different
    blog_post = ModelHelpers.insert_blog_post()
    user = ModelHelpers.insert_normal_user()
    comment_params = @valid_comment_params |> Map.merge(%{
      blog_post_id: blog_post.id, email_id: user.primary_email_id
    })

    conn = post(conn, "/comments", comment: comment_params)
    persisted_id = json_response(conn, 201)["id"]

    assert persisted_id

    comment = get_comment(persisted_id)

    assert comment |> Map.take([:content]) == @valid_comment_params
    assert comment.email_id == user.primary_email_id
    assert comment.confirmed_at == nil
    assert comment.blog_post_id == blog_post.id
    assert Comment.count() == 1
  end

  test "POST /comments for logged-in user assigns the right user and confirmed_at", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    user = ModelHelpers.insert_normal_user()
    admin_user = get_user(blog_post.user_id)
    comment_params = @valid_comment_params |> Map.merge(%{
      blog_post_id: blog_post.id, email_id: admin_user.primary_email_id
    })

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/comments", comment: comment_params)

    assert json_response(conn, 201)["id"]

    comment = get_comment(json_response(conn, 201)["id"])

    assert comment |> Map.take([:content]) == @valid_comment_params
    assert comment.email_id == user.primary_email_id
    assert comment.confirmed_at
    assert comment.blog_post_id == blog_post.id
    assert Comment.count() == 1
  end

  test "POST /comments shouldnt work without blog_post", %{conn: conn} do
    user = ModelHelpers.insert_normal_user()
    comment_params = @valid_comment_params |> Map.merge(%{
      blog_post_id: nil, email_id: user.primary_email_id
    })

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/comments", comment: comment_params)

    assert json_response(conn, 422)["errors"]["blog_post_id"] |> List.first() == "can't be blank"
    assert Comment.count() == 0
  end

  test "POST /comments shouldnt work without content", %{conn: conn} do
    blog_post = ModelHelpers.insert_blog_post()
    comment_params = %{
      blog_post_id: nil, email_id: blog_post.user.primary_email_id
    }

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = post(conn_with_token, "/comments", comment: comment_params)

    assert json_response(conn, 422)["errors"]["content"] |> List.first() == "can't be blank"
    assert Comment.count() == 0
  end

  test "PUT /comments/:id guest cannot edit a comment", %{conn: conn} do
    comment = ModelHelpers.insert_comment()
    comment_params = comment |> Map.merge(@edit_comment_params)

    conn = put(conn, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 401)
    assert get_comment(comment.id) == comment
    assert Comment.count() == 1
  end

  test "PUT /comments/:id normal user can edit his comment", %{conn: conn} do
    user = ModelHelpers.insert_normal_user()
    comment = ModelHelpers.insert_comment(user: user)
    comment_params = comment |> Map.merge(@edit_comment_params)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 200)

    persisted_comment = get_comment(comment.id)
    comment_meta_data = Map.drop(comment, [:content, :updated_at, :confirmed_at, :current_version_id])

    assert comment != persisted_comment
    assert Map.drop(persisted_comment, [:content, :updated_at, :confirmed_at, :current_version_id]) == comment_meta_data
    assert persisted_comment.content == @edit_comment_params |> Map.get(:content)
    assert Comment.count() == 1
  end

  test "PUT /comments/:id normal user cannot edit somebody elses comment", %{conn: conn} do
    comment = ModelHelpers.insert_comment(user: ModelHelpers.insert_admin_user())
    user = ModelHelpers.insert_normal_user()
    comment_params = comment |> Map.merge(@edit_comment_params)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 401)
    assert comment == get_comment(comment.id)
  end

  test "PUT /comments/:id admin user can edit and confirm some users comment", %{conn: conn} do
    normal_user = ModelHelpers.insert_normal_user()
    comment = ModelHelpers.insert_comment(user: normal_user)
    admin_user = ModelHelpers.insert_admin_user()
    comment_params = comment |> Map.merge(@edit_comment_params)

    conn_with_token = set_conn_with_token(conn, admin_user.authentication_token)
    conn = put(conn_with_token, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 200)

    persisted_comment = get_comment(comment.id)
    comment_meta_data = Map.drop(comment, [:content, :updated_at, :confirmed_at, :current_version_id])

    assert comment != persisted_comment
    assert Map.drop(persisted_comment, [:content, :updated_at, :confirmed_at, :current_version_id]) == comment_meta_data
    assert persisted_comment.content == @edit_comment_params |> Map.get(:content)
    assert persisted_comment.email_id == normal_user.primary_email_id
    assert persisted_comment.confirmed_at
    assert Comment.count() == 1
  end

  test "PUT /comments/:id admin can edit and confirm guest comment", %{conn: conn} do
    comment = ModelHelpers.insert_comment()
    user = get_admin_user()
    comment_params = comment |> Map.merge(@edit_comment_params)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 200)

    persisted_comment = get_comment(comment.id)
    comment_meta_data = Map.drop(comment, [:content, :updated_at, :confirmed_at, :current_version_id])

    assert comment != persisted_comment
    assert Map.drop(persisted_comment, [:content, :updated_at, :confirmed_at, :current_version_id]) == comment_meta_data
    assert persisted_comment.content == @edit_comment_params |> Map.get(:content)
    assert persisted_comment.confirmed_at
    assert Comment.count() == 1
  end

  test "PUT /comments/:id admin cannot update a comment when content is invalid", %{conn: conn} do
    comment = ModelHelpers.insert_comment()
    user = get_admin_user()
    comment_params = comment |> Map.merge(@edit_comment_params) |> Map.put(:content, "")

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 422)["errors"]["content"] |> List.first() == "can't be blank"
    assert comment == get_comment(comment.id)
    assert Comment.count() == 1
  end

  test "DELETE /comments/:id guest cannot delete a comment", %{conn: conn} do
    comment = ModelHelpers.insert_comment()

    conn = delete(conn, "/comments/#{comment.id}")

    assert json_response(conn, 401)
    assert get_comment(comment.id) == comment
    assert Comment.count() == 1
  end

  test "DELETE /comments/:id normal user can delete his own comment", %{conn: conn} do
    user = ModelHelpers.insert_normal_user()
    comment = ModelHelpers.insert_comment(%{user: user})

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = delete(conn_with_token, "/comments/#{comment.id}")

    assert response(conn, 204)
    assert get_comment(comment.id) == nil
    assert Comment.count() == 0
  end

  test "DELETE /comments/:id normal user cannot delete somebody elses comment", %{conn: conn} do
    comment = ModelHelpers.insert_comment(%{user: ModelHelpers.insert_admin_user()})
    user = ModelHelpers.insert_normal_user()

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = delete(conn_with_token, "/comments/#{comment.id}")

    assert json_response(conn, 401)
    assert get_comment(comment.id) == comment
    assert Comment.count() == 1
  end

  test "DELETE /comments/:id admin can delete somebody elses comment", %{conn: conn} do
    comment = ModelHelpers.insert_comment(%{user: ModelHelpers.insert_normal_user()})
    user = ModelHelpers.insert_admin_user()

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = delete(conn_with_token, "/comments/#{comment.id}")

    assert response(conn, 204)
    assert get_comment(comment.id) == nil
    assert Comment.count() == 0
  end
end

# test "/comments?filter=latest returns last comments", %{conn: conn} do
#
# end
