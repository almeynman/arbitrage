FROM node:alpine
WORKDIR /assesor-app

COPY assessor-app.zip /assesor-app
RUN unzip assessor-app.zip
ENTRYPOINT node build/app.js
