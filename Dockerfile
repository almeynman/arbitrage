FROM node:alpine
WORKDIR /arbitrage
COPY ./ /arbitrage
RUN npm run bootstrap
CMD node application/dist/server.js
