FROM "inakri/base"

WORKDIR /code/

ADD package-lock.json /code/package-lock.json
ADD package.json /code/package.json

RUN npm install

ADD . /code/

CMD ["./node_modules/.bin/mber", "s"]
