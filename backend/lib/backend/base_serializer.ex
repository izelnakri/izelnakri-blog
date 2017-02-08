defmodule Backend.BaseSerializer do
  def serialize(nil), do: nil

  def serialize(resource) do
    relationships = resource.__struct__.__schema__(:associations)
    Map.drop(resource, [:__meta__, :__struct__] ++ relationships)
  end
end
