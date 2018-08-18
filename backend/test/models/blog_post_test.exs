defmodule Backend.BlogPostTest do
  use Backend.ModelCase, async: true

  alias Backend.BlogPost

  @valid_attrs %{
    "title" => "Testing in Elixir", "slug" => "testing-in-elixir",
    "markdown_content" => "It is awesome. Hello World!", "meta_title" => "Testing in Elixir",
    "meta_description" => "It is awesome. Click to read more", "image_url" => nil,
    "published_at" => nil, "tags" => [%{"name" => "Elixir"}]
  }

  test "changeset with valid attributes" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    changeset = BlogPost.changeset(blog_post_struct, @valid_attrs)

    assert changeset.valid?
  end

  test "changeset without user" do
    changeset = BlogPost.changeset(%BlogPost{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset without title" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{"title" => ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end

  test "changeset without content" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{"markdown_content" => ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end

  test "changeset without slug" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{"slug" => ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end

  test "changeset without tag" do
    user = insert_normal_user()
    blog_post_struct = %BlogPost{user_id: user.id} |> Repo.preload(:user)

    params = @valid_attrs |> Map.merge(%{"tags" => ""})
    changeset = BlogPost.changeset(blog_post_struct, params)

    refute changeset.valid?
  end
end
