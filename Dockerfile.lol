FROM "node:13.12-slim"

ENV PORT=8080

WORKDIR /code/

ADD ["package-lock.json", "package.json", "/code/"]

RUN npm install

ADD ["index.js", "/code/"]

CMD ["/bin/sh"]
