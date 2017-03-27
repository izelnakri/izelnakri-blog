defmodule Backend.EmailTest do
  use Backend.ModelCase, async: true

  alias Backend.Email

  @valid_attributes %{"address" => "contact@izelnakri.com"}

  test "Email.changeset() with valid attributes" do
    changeset = Email.changeset(%Email{}, @valid_attributes)

    assert changeset.valid?
  end

  test "Email.changeset() with invalid email address" do
    changeset = Email.changeset(%Email{}, %{"address" => "contactizelnakri.com"})

    refute changeset.valid?
  end

  test "Email.with_person_changeset without user" do
    changeset = Email.with_person_changeset(%Email{}, @valid_attributes)

    refute changeset.valid?
  end

  test "Email.with_person_changeset with valid attributes" do
    user = insert_normal_user()
    email_struct = %Email{person_id: user.person.id} |> Repo.preload(:person)
    changeset = Email.with_person_changeset(
      email_struct, Map.put(@valid_attributes, "person_id", user.person.id)
    )

    assert changeset.valid?
  end

  test "can confirm an email" do
    email = Email.changeset(%Email{}, @valid_attributes) |> PaperTrail.insert!(origin: "test")
    confirmed_email = email |> Email.confirm(origin: "test")

    assert email.id == confirmed_email.id
    assert email.confirmed_at == nil
    assert confirmed_email != nil
  end
end
