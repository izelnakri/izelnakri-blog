defmodule Backend.UserTest do
  use Backend.ModelCase, async: true

  alias Backend.User

  @valid_attrs %{email: "izelnakri@hotmail.com", is_admin: true, password: "123456"}
  # @invalid_attrs %{}

  test "can create an admin user with password" do
    changeset = User.admin_registration_changeset(%User{}, @valid_attrs)
    assert changeset.valid?
    Repo.insert!(changeset)

    persisted_records = where(User, email: ^@valid_attrs.email) |> Repo.all
    user = persisted_records |> List.first()

    assert persisted_records |> length == 1
    assert user.password == nil
    assert user.password_digest |> String.length == 60
    assert user.is_admin == true
    assert user.authentication_token |> String.length == 64
  end

  # also test the error messages
  test "cannot register an admin without email" do
    admin_params = @valid_attrs |> Map.drop([:email])
    changeset = User.admin_registration_changeset(%User{}, admin_params)
    assert changeset.valid? == false
  end

  test "cannot register an admin with invalid email" do
    admin_params = @valid_attrs |> Map.put(:email, "contactizelnakri.com")
    changeset = User.admin_registration_changeset(%User{}, admin_params)
    assert changeset.valid? == false
  end

  test "cannot register an admin without password" do
    admin_params = @valid_attrs |> Map.drop([:password])
    changeset = User.admin_registration_changeset(%User{}, admin_params)
    assert changeset.valid? == false
  end

  test "cannot register an admin with invalid password" do
    admin_params = @valid_attrs |> Map.put(:password, "12345")
    changeset = User.admin_registration_changeset(%User{}, admin_params)
    assert changeset.valid? == false
  end

  test "user can change their authentication_token" do
    user = User.admin_registration_changeset(%User{}, @valid_attrs) |> Repo.insert!
    old_authentication_token = user.authentication_token
    new_authentication_token = User.generate_authentication_token(user)
      |> Map.get(:authentication_token)

    assert new_authentication_token |> String.length == 64
    assert new_authentication_token != old_authentication_token
  end

  test "user can be confirmed" do
    user = User.registration_changeset(%User{}, @valid_attrs) |> Repo.insert!
    confirmed_user = User.confirm(user)

    assert user.confirmed_at != confirmed_user.updated_at
    assert confirmed_user.confirmed_at != nil
  end
end
