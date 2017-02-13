defmodule Backend.BlogPostTest do
  use Backend.ModelCase

  alias Backend.BlogPost

  @valid_attrs %{
    title: "Elixit is awesome", content: "This is the post content", tag: "Elixir",
    slug: "elixir-is-awesome"
  }

  test "changeset with valid attributes" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    changeset = BlogPost.changeset(blog_post_struct, @valid_attrs)

    assert changeset.valid?
  end

  test "changeset without user" do
    changeset = BlogPost.changeset(%BlogPost{}, @valid_attrs)
    refute changeset.valid?
  end

  test "changeset without title" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{title: ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end

  test "changeset without content" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{content: ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end

  test "changeset without slug" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{slug: ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end

  test "changeset without tag" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{tag: ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end
end