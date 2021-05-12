FROM node:15.14.0-buster

ENV WORKDIR=/server

WORKDIR ${WORKDIR}

COPY ./package.json /
COPY ./package-lock.json /
COPY ./server ${WORKDIR}/

RUN npm install
