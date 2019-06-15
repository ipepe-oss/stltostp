FROM ubuntu:18.04 as builder
RUN apt-get update && apt-get install -y cmake build-essential
RUN mkdir -p /root/src
WORKDIR /root/src
ADD . .
RUN mkdir build && cmake . && make

FROM node:8
COPY --from=builder /root/src/stltostp /usr/local/bin/stltost

WORKDIR /app

COPY api .
RUN npm install

EXPOSE 80
ENV PORT=80
CMD [ "node", "index.js" ]

# docker-compose -f docker-compose.dev.yml up --build
