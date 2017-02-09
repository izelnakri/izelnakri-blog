# defmodule Backend.BookTest do
#   use Backend.ModelCase
#
#   alias Backend.Book
#
#   @valid_attrs %{page_count: 42, title: "some content"}
#   @invalid_attrs %{}
#
#   test "changeset with valid attributes" do
#     changeset = Book.changeset(%Book{}, @valid_attrs)
#     assert changeset.valid?
#   end
#
#   test "changeset with invalid attributes" do
#     changeset = Book.changeset(%Book{}, @invalid_attrs)
#     refute changeset.valid?
#   end
# end
