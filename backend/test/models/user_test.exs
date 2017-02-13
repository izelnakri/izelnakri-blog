defmodule Backend.UserTest do
  use Backend.ModelCase, async: true

  alias Backend.User
  alias Backend.Email

  @valid_attrs %{email: "contact@izelnakri.com", password: "123456"}


  # user must have emails
  test "can create a user" do
    user = User.register(@valid_attrs)

    persisted_emails = Email.query() |> where(address: ^@valid_attrs.email) |> Repo.all
    persisted_user = persisted_emails |> List.first() |> Map.get(:user) |> Repo.preload(:emails)

    assert persisted_emails |> length == 1
    assert persisted_emails |> List.first() |> Map.get(:address) == @valid_attrs.email
    assert user == persisted_user
    assert user.password == nil
    assert user.password_digest |> String.length == 60
    assert user.is_admin == false
    assert user.authentication_token |> String.length == 64
  end

  test "cannot create a user without password" do
    params = @valid_attrs |> Map.put(:password, "")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "cannot create a user with invalid password" do
    params = @valid_attrs |> Map.put(:password, "12345")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "cannot create a user without email" do
    params = @valid_attrs |> Map.put(:email, "")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "cannot create a user with invalid email" do
    params = @valid_attrs |> Map.put(:email, "contactizelnakri.com")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "user can change their authentication_token" do
    user = User.register(@valid_attrs)
    old_authentication_token = user.authentication_token
    new_authentication_token = User.generate_authentication_token(user)
      |> Map.get(:authentication_token)

    assert new_authentication_token |> String.length == 64
    assert new_authentication_token != old_authentication_token
  end

  test "user can change their password" do
    user = User.register(@valid_attrs)
    changed_user = User.password_changeset(user, %{password: "newpassword"}) |> Repo.update!

    assert user.id == changed_user.id
    assert user.password_digest != changed_user.password_digest
    assert user.authentication_token != changed_user.authentication_token
  end

  test "user can become admin" do
    user = User.register(@valid_attrs)
    admin_user = user |> User.make_admin()

    persisted_user = Repo.get!(User, user.id) |> Repo.preload(:emails)

    assert user.is_admin == false
    assert admin_user.is_admin == true
    assert persisted_user == admin_user
    assert user.inserted_at == persisted_user.inserted_at
  end

  test "user emails become confirmed when user becomes admin" do
    user = User.register(@valid_attrs)
    email_struct = %Email{user_id: user.id} |> Repo.preload(:user)
    Email.with_user_changeset(email_struct, %{"address" => "izelnakri@hotmail.com"}) |> Repo.insert!
    User.make_admin(user)

    persisted_user = Repo.get!(User, user.id) |> Repo.preload(:emails)

    assert user.emails |> List.first() |> Map.get(:confirmed_at) == nil
    assert persisted_user.emails |> length() == 2
    assert persisted_user.emails |> Enum.all?(fn(email) -> email.confirmed_at != nil end)
  end
end
