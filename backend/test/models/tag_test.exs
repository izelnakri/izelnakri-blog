defmodule Backend.TagTest do
  use Backend.ModelCase

  alias Backend.Tag

  @valid_attrs %{name: "Elixir"}
  @invalid_attrs %{}

  test "changeset works" do
    changeset = Tag.changeset(%Tag{}, @valid_attrs)
    assert changeset.valid?
  end

  test "cannot have a tag without name" do
    changeset = Tag.changeset(%Tag{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "cannot have two tags with the same name" do
    Tag.changeset(%Tag{}, %{"name" => "Elixir"}) |> Repo.insert!
    tag_two_changeset = Tag.changeset(%Tag{}, %{"name" => "Elixir"}) |> Repo.insert

    assert tag_two_changeset |> elem(0) == :error
    assert tag_two_changeset |> elem(1) |> Map.get(:errors) == [
      name: {"has already been taken", [constraint: :unique, constraint_name: "tags_name_index"]}
    ]
  end

  # test "insert_tags_from_params works at blog_post creation" do
  #
  # end

  # test "insert_tags_from_params works when new tags will get added to blog_post" do
  #
  # end

  # test "insert_tags_from_params works when tags are different than the tags of the blog_post" do
  #
  # end

  # test "delete_tags_diff_from_params works" do
  #
  # end

  # test "delete_tags_from_blog_post/1 works" do
  #
  # end
  #
  # test "delete_tags_from_blog_post/2 works" do
  #
  # end
end
