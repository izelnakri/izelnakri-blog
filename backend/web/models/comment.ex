defmodule Backend.Comment do
  use Backend.Web, :model

  # alias Backend.Email

  schema "comments" do
    field :content, :string
    field :confirmed_at, :utc_datetime

    belongs_to :email, Backend.Email
    belongs_to :blog_post, Backend.BlogPost

    has_one :person, through: [:email, :person]

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

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:content])
    |> validate_required([:content, :blog_post_id])
    |> foreign_key_constraint(:blog_post_id)
    |> foreign_key_constraint(:email_id)
  end

  def creation_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:email_id, :blog_post_id])
    |> changeset(params)
  end

  def creation_with_user_changeset(struct, params \\ %{}) do
    struct
    |> creation_changeset(params)
    |> confirm
  end

  def create(params, current_user \\ nil)
  def create(params, nil) do
    # TODO: if comment has email and its not persisted, create a new email
    changeset = creation_changeset(%__MODULE__{}, params)
    PaperTrail.insert(changeset, origin: "public")
  end
  def create(params, current_user) do
    target_params = Map.put(params, "email_id", current_user.primary_email_id)
    changeset = creation_with_user_changeset(%__MODULE__{}, target_params)
    PaperTrail.insert(changeset, origin: "public")
  end

  def confirm(comment) do
    comment |> change(confirmed_at: DateTime.utc_now())
  end
end
