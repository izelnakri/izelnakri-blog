FROM "inakri/base"

WORKDIR /code/

COPY ["package-lock.json", "package.json", "/code/"]

RUN npm install

ADD . /code/

CMD ["./node_modules/.bin/mber", "s"]
