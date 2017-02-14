defmodule Backend.CommentTest do
  use Backend.ModelCase, async: true

  alias Backend.Comment

  @valid_attrs %{content: "some content"}
  @invalid_attrs %{content: ""}

  # test for comment Comment.user_changeset works with user, shouldnt work without user

  test "changeset with valid attributes" do
    blog_post = insert_blog_post()
    comment_struct = %Comment{blog_post_id: blog_post.id} |> Repo.preload(:blog_post)
    changeset = Comment.changeset(comment_struct, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset without blog post" do
    comment_struct = %Comment{blog_post_id: nil} |> Repo.preload(:blog_post)
    changeset = Comment.changeset(comment_struct, @valid_attrs)

    refute changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Comment.changeset(%Comment{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "Comment.user_changeset with valid attributes assign confirmed_at" do
    blog_post = insert_blog_post()
    comment_struct = %Comment{blog_post_id: blog_post.id} |> Repo.preload(:blog_post)
    changeset = Comment.user_changeset(comment_struct, @valid_attrs)
    assert changeset.valid?
    assert changeset.changes.confirmed_at != nil
  end

  test "Comment.user_changeset with invalid attributes" do
    blog_post = insert_blog_post()
    comment_struct = %Comment{blog_post_id: blog_post.id} |> Repo.preload(:blog_post)
    changeset = Comment.user_changeset(comment_struct, @invalid_attrs)
    refute changeset.valid?
  end
end
