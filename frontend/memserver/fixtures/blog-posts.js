export default [
  {
    id: 1,
    user_id: 1,
    title: 'Application-wide search with Ecto & PostgreSQL',
    tag: 'Elixir',
    slug: 'application-wide-search-with-ecto-and-postgres',
    markdown_content: 'Few months ago I rewrote the search functionality for a web application using only Ecto & PostgreSQL. As it turns out postgres text search is very good. In fact it is so good that I can\'t really notice if its worse than the search results from the former version that used elasticsearch.\n\n#### 1. Database Setup\n\n```sql\n# We are going the search across multiple tables and columns:\nCREATE TABLE companies (\n  id SERIAL PRIMARY KEY,\n  legal_name character varying(255),\n  local_name character varying(255),\n  name character varying(255) NOT NULL,\n  city character varying(255),\n  inserted_at timestamp without time zone NOT NULL,\n  updated_at timestamp without time zone NOT NULL\n);\n\nCREATE TABLE people (\n  id SERIAL PRIMARY KEY,\n  full_name character varying(255) NOT NULL,\n  slug character varying(255) NOT NULL,\n  inserted_at timestamp without time zone NOT NULL,\n  updated_at timestamp without time zone NOT NULL\n);\n\nCREATE UNIQUE INDEX people_slug_index ON people USING btree (slug);\n\n-- Postgres extension for similarity/ranking search:\nCREATE EXTENSION pg_trgm;\n\n-- Add following GIN indexes to speed up the search:\nCREATE INDEX companies_legal_name_trgm_index ON companies USING gin (legal_name gin_trgm_ops);\n\nCREATE INDEX companies_local_name_trgm_index ON companies USING gin (local_name gin_trgm_ops);\n\nCREATE INDEX companies_name_trgm_index ON companies USING gin (name gin_trgm_ops);\n\nCREATE INDEX people_full_name_trgm_index ON people USING gin (full_name gin_trgm_ops);\n```\n\n#### 2. Insert Records:\n\n```sql\nINSERT INTO companies (legal_name, local_name, name, city, inserted_at, updated_at) VALUES\n  (\'International Immobiliare S.p.a.\', \'Immobiliare\', \'International Immobiliare\', \'Vatican City\', now(), now()),\n  (\'Genco Pura Olive Oil Company &amp; Co.\', \'GENCO\', \'Genco Olive Oil\', \'New York\', now(), now()),\n  (\'Tropigala Las Vegas Inc.\', \'Tropigala\', \'Tropigala\', \'Las Vegas\', now(), now()),\n  (\'Luna Restaurant LLC.\', \'Luna Restaurant\', \'Luna Restaurant\', \'New York\', now(), now()),\n  (\'Abbandando Grosseria LLC.\', \'Abbandando Grosseria\', \'Abbandando Grosseria\', \'New York\', now(), now()),\n  (\'Habana Capri\', \'Habana Capri\', \'Havana Capri Hotel\', \'Havana\', now(), now());\n\nINSERT INTO people (full_name, slug, inserted_at, updated_at) VALUES\n  (\'Vito Andolini Corleone\', \'vito-corleone\', now(), now()),\n  (\'Michael Corleone\', \'michael-corleone\', now(), now()),\n  (\'Tom Hagen\', \'tom-hagen\', now(), now()),\n  (\'Peter Clemenza\', \'peter-clemenza\', now(), now()),\n  (\'Hyman Roth\', \'hyman-roth\', now(), now()),\n  (\'Moe Greene\', \'moe-greene\', now(), now()),\n  (\'Don Fanucci\', \'don-fanucci\', now(), now()),\n  (\'Signor Abbandando\', \'signor-abbandando\', now(), now());\n```\n\n#### 3. Devise the queries:\n\n```sql\n# Person search:\nSELECT person,\nsimilarity(person.full_name, \'search term\') AS rank\nFROM "people" person\nWHERE (similarity(person.full_name, \'search term\') > 0.1::float)\nORDER BY rank DESC\nLIMIT 5;\n\n# Company search: rank column represents the highest rank across 3 name columns:\nSELECT company,\nGREATEST(similarity(company.legal_name, \'search term\'),\n  similarity(company.local_name, \'search term\'),\n  similarity(company.name, \'search term\')\n) AS rank\nFROM "companies" company\nWHERE (similarity(company.legal_name, \'search term\') > 0.1::float) OR\n  (similarity(company.local_name, \'search term\') > 0.1::float) OR\n  (similarity(company.name, \'search term\') > 0.1::float)\nORDER BY rank DESC\nLIMIT 5;\n```\n\n#### 4. Advanced queries in Ecto:\n\n```elixir\n# in web/models/company.ex:\ndefmodule Application.Company do\n  use Application.Web, :model\n\n  alias Application.Repo\n\n  schema "companies" do\n    field :city, :string\n    field :legal_name, :string\n    field :local_name, :string\n    field :name, :string\n\n    timestamps()\n  end\n\n  def search(search_term) do\n    from(\n      company in __MODULE__,\n      # BONUS: YOU CAN EVEN DO JOINS HERE!!\n      select: %{\n        company: company,\n        rank: fragment("GREATEST(similarity(?, ?), similarity(?, ?), similarity(?, ?)) AS rank",\n          company.local_name, ^search_term, company.legal_name, ^search_term, company.name,\n          ^search_term\n        ),\n\t  },\n      where: fragment("similarity(?, ?)", company.legal_name, ^search_term) > 0.05 or\n        fragment("similarity(?, ?)", company.name, ^search_term) > 0.05 or\n        fragment("similarity(?, ?)", company.local_name, ^search_term) > 0.05,\n      order_by: fragment("rank DESC"),\n      limit: 5\n    ) |> Repo.all\n  end\nend\n\n# in web/models/person.ex\ndefmodule Application.Person do\n  use Application.Web, :model\n\n  alias Application.Repo\n\n  schema "people" do\n    field :full_name, :string\n    field :slug, :string\n\n    timestamps()\n  end\n\n  def search(search_term) do\n    from(\n      person in __MODULE__,\n      select: %{\n        person: person,\n        rank: fragment("similarity(?, ?) AS rank", person.full_name, ^search_term)\n\t  },\n      where: fragment("similarity(?, ?)", person.full_name, ^search_term) > 0.05,\n      order_by: fragment("rank DESC"),\n      limit: 5\n    ) |> Repo.all\n  end\nend\n```\n\n#### 5. Parallel queries and JSON serialization with Elixir:\n\n```elixir\n# in web/controllers/search_controller.ex:\ndefmodule Application.SearchController do\n  use Application.Web, :controller\n\n  alias Application.Company\n  alias Application.Person\n\n  def search(conn, %{"query" => query}) do\n    people_search = Task.async(fn -> Person.search(query) end)\n    companies_search = Task.async(fn -> Company.search(query) end)\n\n    results = Task.await(people_search) ++ Task.await(companies_search)\n\n    sorted_results = Enum.sort(results, fn(current_result, other_result) ->\n      Map.get(current_result, :rank) |> Map.get(other_result, :rank)\n    end) |> Enum.map(fn(result) -> search_serializer(result) end)\n\n    json conn, %{results: sorted_results}\n  end\n\n  defp search_serializer(%{:company => company}) do\n    %{company: serialize(company)}\n  end\n\n  defp search_serializer(%{:person => person}) do\n    %{person: serialize(person)}\n  end\n\n  defp serialize(nil), do: nil\n\n  defp serialize(model) do\n    relationships = model.__struct__.__schema__(:associations)\n    Map.drop(model, [:__meta__, :__struct__] ++ relationships)\n  end\nend\n```\n',
    meta_title: 'Application-wide search with Ecto & PostgreSQL',
    meta_description: '',
    published_at: null,
    inserted_at: '2017-02-17T17:27:34.986242',
    updated_at: '2017-02-17T17:46:27.503653'
  },
  {
    id: 2,
    user_id: 1,
    title: 'nihaha',
    tag: 'Nihaha',
    slug: 'nihaha',
    markdown_content: 'nihaaa',
    meta_title: '',
    meta_description: '',
    published_at: null,
    inserted_at: '2017-02-17T18:25:28.538063',
    updated_at: '2017-02-17T18:25:28.538115'
  }
];
