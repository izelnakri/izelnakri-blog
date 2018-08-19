FROM "inakri/base"

WORKDIR /code/

ADD ["package-lock.json", "package.json", "/code/"]

RUN npm install

ADD . /code/

CMD ["/bin/sh"]
