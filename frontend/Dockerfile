FROM "gcr.io/izelnakri-210919/base"

WORKDIR /code/

ADD package-lock.json /code/package-lock.json
ADD package.json /code/package.json

RUN npm install

ADD . /code/

ENTRYPOINT "/bin/bash"
