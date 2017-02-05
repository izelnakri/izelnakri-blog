CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  legal_name character varying(255),
  local_name character varying(255),
  name character varying(255) NOT NULL,
  city character varying(255),
  inserted_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  full_name character varying(255) NOT NULL,
  slug character varying(255) NOT NULL,
  inserted_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE UNIQUE INDEX people_slug_index ON people USING btree (slug);

-- Postgres extension for similarity/ranking search:
CREATE EXTENSION pg_trgm;

-- Add following GIN indexes to speed up our search:
CREATE INDEX companies_legal_name_trgm_index ON companies USING gin (legal_name gin_trgm_ops);

CREATE INDEX companies_local_name_trgm_index ON companies USING gin (local_name gin_trgm_ops);

CREATE INDEX companies_name_trgm_index ON companies USING gin (name gin_trgm_ops);

CREATE INDEX people_full_name_trgm_index ON people USING gin (full_name gin_trgm_ops);
