FROM ubuntu:18.04
RUN apt-get update && apt-get install -y git build-essential cmake libtool dh-autoreconf cmake git python3-setuptools python3-sip-dev tar gzip wget
RUN mkdir -p /root/stl_to_stp
WORKDIR /root/stl_to_stp
ADD . .
RUN mkdir build && cmake . && make

RUN echo "sleep 100000000000" >> /copy.sh
RUN chmod +x /copy.sh
ENTRYPOINT '/copy.sh'

# docker-compose -f docker-compose.dev.yml up --build
# docker exec -it stltostp_server_1 bash