FROM "alpine:3.8"

RUN apk update && apk add build-base postgresql vim git nodejs npm elixir chromium

# NOTE: Manually compile might needed: nodejs is old 8.x, elixir is 1.6.x

CMD "/bin/sh"
