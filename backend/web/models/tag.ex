defmodule Backend.Tag do
  use Backend.Web, :model

  schema "tags" do
    field :name, :string

    # has_many :blog_posts, through:

    timestamps()
  end

  def changeset(struct, params) do
    struct
    |> cast(params, [:name])
    |> validate_required(:name)
  end
end
