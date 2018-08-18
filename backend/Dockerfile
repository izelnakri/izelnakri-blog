FROM "inakri/base"

WORKDIR /code/

RUN mix local.hex --force && mix local.rebar --force

COPY ["mix.lock", "mix.exs", "/code/"]

RUN mix deps.get

ADD . /code/

RUN mix compile

CMD ["mix", "phx.server"]

# mix ecto.create
# mix ecto.migrate
