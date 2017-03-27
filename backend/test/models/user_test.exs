defmodule Backend.UserTest do
  use Backend.ModelCase, async: true

  alias Backend.User
  alias Backend.Email

  @valid_attrs %{email: "contact@izelnakri.com", password: "123456", full_name: "Izel Nakri"}

  # test user serializer and authentication_serializer

  test "User.register/2 works" do
    user = User.register(@valid_attrs)

    persisted_emails = Email.query() |> where(address: ^@valid_attrs.email) |> Repo.all
    persisted_user = persisted_emails
      |> List.first()
      |> Repo.preload(:user)
      |> Map.get(:user)
      |> Repo.preload(:emails)
      |> Repo.preload(:primary_email)

    assert persisted_emails |> length == 1
    assert persisted_emails |> List.first() |> Map.get(:address) == @valid_attrs.email
    assert user |> Repo.preload(:emails) == persisted_user
    assert user.password == nil
    assert user.password_digest |> String.length == 60
    assert user.is_admin == false
    assert user.authentication_token |> String.length == 64
  end

  test "cannot register a user without password" do
    params = @valid_attrs |> Map.put(:password, "")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "cannot register a user with invalid password" do
    params = @valid_attrs |> Map.put(:password, "12345")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "cannot register a user without email" do
    params = @valid_attrs |> Map.put(:email, "")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "cannot register a user with invalid email" do
    params = @valid_attrs |> Map.put(:email, "contactizelnakri.com")
    changeset = User.register(params)
    assert changeset.valid? == false
  end

  test "User.login() works" do
    user = User.register(@valid_attrs)
    logged_in_user = User.login(@valid_attrs)

    assert logged_in_user |> Map.drop([:updated_at, :last_login_at]) == user |> Map.drop([
      :updated_at, :last_login_at
    ])
    assert logged_in_user.updated_at != user.updated_at
    assert logged_in_user.last_login_at != user.last_login_at
    assert User.login(%{email: @valid_attrs.email, password: "wrongpassword"}) == nil
    assert User.login(%{email: "wrongemail@hotmail.com", password: @valid_attrs.password}) == nil
  end

  test "user can change their authentication_token" do
    user = User.register(@valid_attrs)
    old_authentication_token = user.authentication_token
    new_authentication_token = User.generate_authentication_token(user) |> Repo.update!
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

  test "User.make_admin() works" do
    user = User.register(@valid_attrs)
    admin_user = user |> User.make_admin(origin: "test")

    persisted_user = User.query() |> where([user], id: ^user.id) |> Repo.one

    assert user.is_admin == false
    assert admin_user.is_admin == true
    assert persisted_user == admin_user
    assert user.inserted_at == persisted_user.inserted_at
  end

  test "User.make_admin() makes users emails confirmed" do
    user = User.register(@valid_attrs)
    email_struct = %Email{person_id: user.person.id} |> Repo.preload(:person)
    Email.with_person_changeset(email_struct, %{"address" => "izelnakri@hotmail.com"})
    |> PaperTrail.insert!(origin: "test")
    User.make_admin(user, origin: "test")

    persisted_user = Repo.get!(User, user.id) |> Repo.preload(:emails)

    assert user.person.emails |> List.first() |> Map.get(:confirmed_at) == nil
    assert persisted_user.emails |> length() == 2
    assert persisted_user.emails |> Enum.all?(fn(email) -> email.confirmed_at != nil end)
  end
end
