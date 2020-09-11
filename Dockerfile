FROM "alpine:3.12"

RUN apk update && apk --no-cache add build-base postgresql vim git nodejs npm elixir chromium

# NOTE: Manually compile might needed: nodejs is old 8.x, elixir is 1.6.x

CMD "/bin/sh"
