FROM node:12

COPY . /app

WORKDIR /app

RUN yarn && yarn tsc

ENTRYPOINT [ "/entrypoint.sh" ]
