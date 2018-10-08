FROM node:8-alpine

LABEL maintainer="Link <xieaolin@foxmail.com>"

WORKDIR /var/www
COPY lib/ ./lib/
COPY *.js ./
COPY package* ./

RUN npm install --production --registry=https://registry.npm.taobao.org

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000
CMD ["npm", "run", "start"]