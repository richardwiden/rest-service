FROM node:latest
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY app /usr/src/app
EXPOSE 3000
CMD ["npm","start"]