defmodule Backend.PersonTest do
  use Backend.ModelCase

  alias Backend.Person

  @valid_attrs %{full_name: "Izel Nakri"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Person.changeset(%Person{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Person.changeset(%Person{}, @invalid_attrs)
    refute changeset.valid?
  end
end
