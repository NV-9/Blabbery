FROM node:23.10-bookworm-slim as node

WORKDIR /app

COPY front/web/package.json front/web/package-lock.json ./

RUN npm install && npm cache clean --force

COPY front/web/ .

EXPOSE 5173

CMD ["npm", "run", "devwatch"]
