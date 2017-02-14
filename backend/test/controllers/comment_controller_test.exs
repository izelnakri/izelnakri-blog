defmodule Backend.CommentControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.Comment

  @valid_comment_params %{content: "this is a comment"}
  @edit_comment_params %{content: "Interesting post, edited my comment"}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "POST /comments as guest works", %{conn: conn} do
    blog_post = insert_blog_post()

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
    blog_post = insert_blog_post()
    user = insert_normal_user()

    comment_params = @valid_comment_params |> Map.merge(%{
      blog_post_id: blog_post.id, email_id: user.emails |> List.first() |> Map.get(:id)
    })

    conn = post(conn, "/comments", comment: comment_params)

    persisted_id = json_response(conn, 201)["id"]
    assert persisted_id

    comment = get_comment(persisted_id)

    assert comment |> Map.take([:content]) == @valid_comment_params
    assert comment.email_id == user.emails |> List.first() |> Map.get(:id)
    assert comment.confirmed_at == nil
    assert comment.blog_post_id == blog_post.id

    assert Comment.count() == 1
  end

  test "POST /comments for logged-in user assigns the right user and confirmed_at", %{conn: conn} do
    blog_post = insert_blog_post()
    user = insert_normal_user()

    admin_user = get_user(blog_post.user_id)
    # IO.puts("admin_user is:")
    # admin_user |> inspect |> IO.puts

    comment_params = @valid_comment_params |> Map.merge(%{
      blog_post_id: blog_post.id, email_id: user.emails |> List.first() |> Map.get(:id)
    })

    conn_with_token = set_conn_with_token(conn, admin_user.authentication_token)
    conn = post(conn_with_token, "/comments", comment: comment_params)

    persisted_id = json_response(conn, 201)["id"]
    assert persisted_id

    comment = get_comment(persisted_id)
    # IO.puts("comment is:")
    # comment |> inspect |> IO.puts

    assert comment |> Map.take([:content]) == @valid_comment_params
    assert comment.email_id == admin_user.emails |> List.first() |> Map.get(:id)
    assert comment.confirmed_at != nil
    assert comment.blog_post_id == blog_post.id

    assert Comment.count() == 1
  end

  test "POST /comments shouldnt work without blog_post", %{conn: conn} do
    user = insert_normal_user()

    comment_params = @valid_comment_params |> Map.merge(%{
      blog_post_id: nil, email_id: user.emails |> List.first() |> Map.get(:id)
    })

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = post(conn_with_token, "/comments", comment: comment_params)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["blog_post_id"] |> List.first() == "can't be blank"

    assert Comment.count() == 0
  end

  test "POST /comments shouldnt work without content", %{conn: conn} do
    blog_post = insert_blog_post()

    comment_params = %{
      blog_post_id: nil, email_id: blog_post.user.emails |> List.first() |> Map.get(:id)
    }

    conn_with_token = set_conn_with_token(conn, blog_post.user.authentication_token)
    conn = post(conn_with_token, "/comments", comment: comment_params)

    response = json_response(conn, 422)
    assert response
    assert response["errors"]["content"] |> List.first() == "can't be blank"

    assert Comment.count() == 0
  end

  test "PUT /comments/:id guest cannot edit a comment", %{conn: conn} do
    comment = insert_comment()

    comment_params = comment |> Map.merge(@edit_comment_params)

    conn = put(conn, "/comments/#{comment.id}", comment: comment_params)

    persisted_comment = get_comment(comment.id)

    assert json_response(conn, 401)["errors"]

    assert comment == persisted_comment
    assert Comment.count() == 1
  end

  test "PUT /comments/:id normal user can edit his comment", %{conn: conn} do
    comment = insert_comment()
    user = get_email(comment.email_id) |> Map.get(:user)

    comment_params = comment |> Map.merge(@edit_comment_params)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = put(conn_with_token, "/comments/#{comment.id}", comment: comment_params)

    assert json_response(conn, 200)

    persisted_comment = get_comment(comment.id)
    comment_meta_data = Map.drop(comment, [:content, :updated_at])

    assert comment != persisted_comment
    assert Map.drop(persisted_comment, [:content, :updated_at]) == comment_meta_data
    assert persisted_comment.content == @edit_comment_params |> Map.get(:content)

    assert Comment.count() == 1
  end

  # test "PUT /comments/:id normal user cannot edit somebody elses comment", %{conn: conn} do
  #   comment = insert_comment()
  #   user = insert_normal_user
  #
  #   comment
  #
  # end

  # test "PUT /comments/:id admin user can edit and publish somebody elses comment", %{conn: conn} do
  #
  # end
  #
  # test "PUT /comments/:id admin can make a comment published", %{conn: conn} do
  #
  # end
  #
  # test "PUT /comments/:id admin cannot update a comment when content is invalid", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /comments/:id guest cannot delete a comment", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /comments/:id normal user can delete his own comment", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /comments/:id normal user cannot delete somebody elses comment", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /comments/:id admin can delete somebody elses comment", %{conn: conn} do
  #
  # end
end


# test "creates and renders resource when data is valid", %{conn: conn} do
#   conn = post conn, book_path(conn, :create), book: @valid_attrs
#   assert json_response(conn, 201)["data"]["id"]
#   assert Repo.get_by(Book, @valid_attrs)
# end
#
# test "does not create resource and renders errors when data is invalid", %{conn: conn} do
#   conn = post conn, book_path(conn, :create), book: @invalid_attrs
#   assert json_response(conn, 422)["errors"] != %{}
# end
#
# test "updates and renders chosen resource when data is valid", %{conn: conn} do
#   book = Repo.insert! %Book{}
#   conn = put conn, book_path(conn, :update, book), book: @valid_attrs
#   assert json_response(conn, 200)["data"]["id"]
#   assert Repo.get_by(Book, @valid_attrs)
# end
#
# test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
#   book = Repo.insert! %Book{}
#   conn = put conn, book_path(conn, :update, book), book: @invalid_attrs
#   assert json_response(conn, 422)["errors"] != %{}
# end
#
# test "deletes chosen resource", %{conn: conn} do
#   book = Repo.insert! %Book{}
#   conn = delete conn, book_path(conn, :delete, book)
#   assert response(conn, 204)
#   refute Repo.get(Book, book.id)
# end


# test "/comments?filter=latest returns last comments", %{conn: conn} do
#
# end
