# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Backend.Repo.insert!(%Backend.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

%Backend.User{
  email: "contact@izelnakri.com",
  password_digest: "$2b$12$55wLEPk1EgAR1e1HTn2XGuplg3Aj7eXdkEh9QML2oOcePWIiZUxKO",
  is_admin: true,
  authentication_token: "_BMRc-h_ro3d4zLgVis5t-QjLp3pX2jx1CpM4g-Fd3I9M-0aFvQ9xf-pcyiDMMia"
} |> Repo.insert!
