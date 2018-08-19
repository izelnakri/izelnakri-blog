FROM "inakri/base"

ARG MIX_ENV=dev
ENV MIX_ENV=$MIX_ENV

WORKDIR /code/

RUN echo "y" | mix local.hex --if-missing && echo "y" | mix local.rebar --if-missing

ADD ["mix.lock", "mix.exs", "/code/"]

RUN mix deps.get && MIX_ENV=test mix deps.compile && \
  MIX_ENV=$MIX_ENV mix deps.compile && MIX_ENV=prod mix deps.compile

ADD . /code/

RUN MIX_ENV=test mix compile && MIX_ENV=$MIX_ENV mix compile

CMD ["/bin/sh"]
