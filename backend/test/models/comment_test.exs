defmodule Backend.CommentTest do
  use Backend.ModelCase

  alias Backend.Comment

  @valid_attrs %{content: "some content"}
  @invalid_attrs %{content: ""}

  test "changeset with valid attributes" do
    blog_post = insert_blog_post()
    comment_struct = %Comment{blog_post_id: blog_post.id} |> Repo.preload(:blog_post)
    changeset = Comment.changeset(comment_struct, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset without blog post" do
    changeset = Comment.changeset(%Comment{}, @valid_attrs)

    refute changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Comment.changeset(%Comment{}, @invalid_attrs)
    refute changeset.valid?
  end
end
