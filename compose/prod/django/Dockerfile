FROM node:23.10-bookworm-slim as node

WORKDIR /app

COPY front/web/package.json front/web/package-lock.json ./
RUN npm ci && npm cache clean --force

COPY front/web/ .
RUN npm run build

FROM docker.io/python:3.13.2-slim-bookworm as python

ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1 \
    PIP_NO_CACHE_DIR=1 \
    PATH=/usr/local/bin:$PATH

RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    gettext \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app 

COPY requirements/ /app/
RUN pip install --upgrade pip && pip install -r prod.txt

COPY compose/prod/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

ENTRYPOINT ["/start"]