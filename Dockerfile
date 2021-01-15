FROM node:12

COPY . /app

WORKDIR /app

RUN yarn && yarn tsc

ENTRYPOINT [ "/app/entrypoint.sh" ]
