defmodule Backend.Comment do
  use Backend.Web, :model

  schema "comments" do
    field :content, :string
    field :confirmed_at, :utc_datetime

    belongs_to :email, Backend.Email
    belongs_to :blog_post, Backend.BlogPost

    timestamps()
  end

  def query(_query \\ %{}) do
    from(
      comment in __MODULE__,
      left_join: email in assoc(comment, :email),
      join: blog_post in assoc(comment, :blog_post),
      preload: [blog_post: blog_post, email: email]
    )
  end

  def serializer(comment) do
    serialize(comment) |> Map.merge(%{
      email: comment.email
    })
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:content])
    |> validate_required([:content])
    |> cast_assoc(:email)
    |> cast_assoc(:blog_post, required: true)
    |> assoc_constraint(:blog_post)
  end
end
