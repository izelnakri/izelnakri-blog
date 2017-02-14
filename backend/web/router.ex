defmodule Backend.Router do
  use Backend.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug Backend.RecognizeUserFromToken 
  end

  scope "/", Backend do
    pipe_through :api

    get "/", PageController, :index
    get "/me", UserController, :show
    post "/login", UserController, :login

    resources "/blog-posts", BlogPostController, only: [:create, :index, :update, :delete]
    resources "/comments", CommentController, only: [:create, :index, :update, :delete]
  end
end
