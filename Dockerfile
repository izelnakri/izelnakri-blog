FROM "base/archlinux:2018.08.01"

RUN echo "LC_ALL=en_US.UTF-8" >> /etc/environment && \
  echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "LANG=en_US.UTF-8" > /etc/locale.conf

RUN locale-gen en_US.UTF-8

ENV LANGUAGE=en_US.UTF-8 \
  LC_ALL=en_US.UTF-8 \
  LANG=en_US.UTF-8 \
  LC_TYPE=en_US.UTF-8

RUN pacman -Syu vim python2 make gcc postgresql git nodejs npm chromium elixir --noconfirm

ENTRYPOINT "/bin/bash"
