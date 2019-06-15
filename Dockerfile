FROM ubuntu:18.04 as builder
RUN apt-get update && apt-get install -y cmake build-essential
RUN mkdir -p /root/stl_to_stp
WORKDIR /root/stl_to_stp
ADD . .
RUN mkdir build && cmake . && make

COPY --from=builder /go/src/github.com/xcoulon/go-url-shortener/bin/go-url-shortener /usr/local/bin/go-url-shortener

FROM node:8


# docker-compose -f docker-compose.dev.yml up --build
# docker exec -it stltostp_server_1 bash