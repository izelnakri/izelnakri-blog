defmodule Backend.UserControllerTest do
  use Backend.ConnCase, async: true

  @normal_user_attrs %{email: "normaluser@gmail.com", password: "123456"}

  test "POST /login succesfully logs a person in", %{conn: conn} do
    user = insert_normal_user(@normal_user_attrs)

    conn = post(conn, "/login", @normal_user_attrs)

    response = json_response(conn, 200)["user"]
    assert response
    assert response == get_authenticated_user(user.id) |> convert_to_string_map()
  end

  test "POST /login gives error when email is missing", %{conn: conn} do
    insert_normal_user(@normal_user_attrs)

    conn = post(conn, "/login", email: "", password: @normal_user_attrs.password)

    assert json_response(conn, 401)["errors"]
  end

  test "POST /login gives error when password is missing", %{conn: conn} do
    insert_normal_user(@normal_user_attrs)

    conn = post(conn, "/login", email: @normal_user_attrs.email, password: "")

    assert json_response(conn, 401)["errors"]
  end

  test "POST /login gives error for wrong email password combination", %{conn: conn} do
    insert_normal_user(@normal_user_attrs)

    conn = post(conn, "/login", email: @normal_user_attrs.email, password: "wrongpassword")
    assert json_response(conn, 401)["errors"]

    second_conn = post(conn, "/login", email: "wrongemail", password: @normal_user_attrs.password)
    assert json_response(second_conn, 401)["errors"]
  end

  test "GET /me works with right authentication_token", %{conn: conn} do
    user = insert_normal_user(@normal_user_attrs)

    conn_with_token = set_conn_with_token(conn, user.authentication_token)
    conn = get(conn_with_token, "/me")

    response = json_response(conn, 200)["user"]
    assert response
    assert response == get_authenticated_user(user.id) |> convert_to_string_map()
  end

  test "GET /me shouldnt work with wrong authentication_token", %{conn: conn} do
    insert_normal_user(@normal_user_attrs)

    conn_with_token = set_conn_with_token(conn, "somewrongtoken")
    conn = get(conn_with_token, "/me")

    assert json_response(conn, 401)["errors"]
  end

  test "GET /me gives error for requests without authentication_token", %{conn: conn} do
    insert_normal_user(@normal_user_attrs)

    conn = get(conn, "/me")
    assert json_response(conn, 401)["errors"]
  end
end
