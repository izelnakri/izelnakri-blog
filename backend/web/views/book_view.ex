# defmodule Backend.BookView do
#   use Backend.Web, :view
#
#   def render("index.json", %{books: books}) do
#     %{data: render_many(books, Backend.BookView, "book.json")}
#   end
#
#   def render("show.json", %{book: book}) do
#     %{data: render_one(book, Backend.BookView, "book.json")}
#   end
#
#   def render("book.json", %{book: book}) do
#     %{id: book.id,
#       title: book.title,
#       page_count: book.page_count}
#   end
# end
