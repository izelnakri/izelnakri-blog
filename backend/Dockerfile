FROM "inakri/base"

ARG MIX_ENV=dev
ENV MIX_ENV=$MIX_ENV

WORKDIR /code/

RUN mix local.hex --force && mix local.rebar --force

ADD ["mix.lock", "mix.exs", "/code/"]

RUN mix deps.get && MIX_ENV=test mix deps.compile && MIX_ENV=$MIX_ENV mix deps.compile

ADD . /code/

RUN mix compile && MIX_ENV=$MIX_ENV mix compile

CMD ["/bin/sh"]


# mix ecto.create
# mix ecto.migrate
