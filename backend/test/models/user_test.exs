defmodule Backend.UserTest do
  use Backend.ModelCase

  alias Backend.User

  @valid_attrs %{authentication_token: "some content", email: "some content", is_admin: true, password_digest: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
