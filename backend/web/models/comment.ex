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
      left_join: user in assoc(email, :user),
      join: blog_post in assoc(comment, :blog_post),
      preload: [
        blog_post: blog_post,
        email: {email, [user: user]}
      ]
    )
  end

  def serializer(nil), do: nil
  def serializer(comment) do
    serialize(comment)
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:content])
    |> validate_required([:content, :blog_post_id])
    |> foreign_key_constraint(:blog_post_id)
    |> foreign_key_constraint(:email_id)
  end

  def user_changeset(struct, params \\ %{}) do
    struct
    |> changeset(params)
    |> change(confirmed_at: DateTime.utc_now())
  end
end
