defmodule Backend.EmailTest do
  use Backend.ModelCase

  alias Backend.Email

  @valid_attributes %{"address" => "contact@izelnakri.com"}

  test "can confirm an email" do
    email = Email.changeset(%Email{}, @valid_attributes) |> Repo.insert!
    confirmed_email = email |> Email.confirm()

    assert email.id == confirmed_email.id
    assert email.confirmed_at == nil
    assert confirmed_email != nil
  end

  test "Email.changeset() with valid attributes" do
    changeset = Email.changeset(%Email{}, @valid_attributes)

    assert changeset.valid?
  end

  test "Email.changeset() with invalid attributes" do
    changeset = Email.changeset(%Email{}, %{"address" => "contactizelnakri.com"})

    refute changeset.valid?
  end

  test "Email.with_user_changeset with valid attributes" do
    user = insert_normal_user()
    email_struct = %Email{user_id: user.id} |> Repo.preload(:user)
    changeset = Email.with_user_changeset(email_struct, Map.put(@valid_attributes, "user_id", user.id))

    assert changeset.valid?
  end

  test "Email.with_user_changeset without user" do
    changeset = Email.with_user_changeset(%Email{}, @valid_attributes)

    refute changeset.valid?
  end
end
