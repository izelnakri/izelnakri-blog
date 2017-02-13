defmodule Backend.CommentControllerTest do
  use Backend.ConnCase, async: true

  alias Backend.Comment

  @valid_comment_params %{content: "this is a comment"}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  # test "POST /comments as guest works", %{conn: conn} do
  #   blog_post = insert_blog_post()
  #   IO.puts("blog post is:")
  #   blog_post |> inspect |> IO.puts
  #
  #   comment_params = @valid_comment_params
  #     |> Map.merge(%{blog_post: blog_post})
  #     |> Map.drop([:user])
  #
  #   conn = post(conn, "/comments", comment: comment_params)
  #
  #   persisted_id = json_response(conn, 201)["id"]
  #   assert persisted_id
  #
  #   comment = get_comment(persisted_id) |> Map.drop([:updated_at])
  #
  #   comment_attrs = comment |> Map.get([:content])
  #
  #   assert comment_attrs == @valid_comment_params
  #   assert comment.user == nil
  #   assert comment.confirmed_at == nil
  #   assert comment.blog_post == blog_post
  #
  #   assert Comment.count() == 1
  # end

  # test "POST /comments as user works", %{conn: conn} do
  #   blog_post = insert_blog_post()
  #   user = insert_normal_user(%{email: "izelnakri@hotmail.com"})
  #   comment_params = @valid_comment_params |> Map.merge(%{blog_post: blog_post, user: user})
  #
  #   conn = post(conn, "/comments", comment: comment_params)
  #
  #   persisted_id = json_response(conn, 201)["id"]
  #   assert persisted_id
  #
  #   comment = get_comment(persisted_id) |> Map.drop([:updated_at])
  #
  #   comment_attrs = comment |> Map.get([:text])
  #
  #   assert comment_attrs == @valid_comment_params
  #   assert comment.user == user
  #   assert comment.confirmed_at == nil
  #   assert comment.blog_post == blog_post
  #
  #   assert Comment.count() == 1
  # end

  # test "POST /comments shouldnt work without blog_post", %{conn: conn} do
  #
  # end

  # test "POST /comments shouldnt work without content", %{conn: conn} do
  #
  # end

  # test "PUT /comments/:id can make a comment published", %{conn: conn} do
  #
  # end
  #
  # test "PUT /comments/:id cannot update when data is invalid", %{conn: conn} do
  #
  # end
  #
  # test "PUT /comments/:id guest cannot edit a comment", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /comments/:id deletes a comment", %{conn: conn} do
  #
  # end
  #
  # test "DELETE /comments/:id guest cannot delete a comment", %{conn: conn} do
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
