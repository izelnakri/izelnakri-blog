FROM "base/archlinux:2018.08.01"

RUN pacman -Syu vim python2 make gcc git nodejs npm chromium elixir --noconfirm

ENTRYPOINT "/bin/bash"
