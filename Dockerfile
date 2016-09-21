FROM node:latest
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY app /usr/src/app
RUN npm install -g nodemon
RUN npm install -g node-gyp
RUN node-gyp clean
RUN npm cache clean
RUN npm install
EXPOSE 3000
CMD ["npm","start"]