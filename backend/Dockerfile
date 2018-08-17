FROM "inakri/base"

WORKDIR /code/

RUN mix local.hex --force && mix local.rebar --force

ADD mix.lock /code/mix.lock
ADD mix.exs /code/mix.exs

RUN mix deps.get

ADD . /code/

RUN chmod +x ./setup-database.sh && mix compile

ENTRYPOINT "/bin/bash"

# mix ecto.create
# mix ecto.migrate
# mix phx.server
