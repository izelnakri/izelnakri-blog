defmodule Backend.Utils do
  def random_string(length) do
    :crypto.strong_rand_bytes(length) |> Base.url_encode64 |> binary_part(0, length)
  end

  def serialize(nil), do: nil
  def serialize(resource) do
    relationships = resource.__struct__.__schema__(:associations)
    Map.drop(resource, [:__meta__, :__struct__] ++ relationships)
  end
end
