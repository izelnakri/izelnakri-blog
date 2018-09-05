FROM "inakri/base-slim"

ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /code/

ADD ["package-lock.json", "package.json", "/code/"]

RUN npm install

ADD . /code/

CMD ["/bin/sh"]
