FROM node:19

# Install Self Signed Certs
RUN apt update && apt -y install libnss3-tools
RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && chmod +x mkcert-v*-linux-amd64 && cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

#USER node

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node . .

#Create Certs
RUN mkcert -install && mkcert 192.168.86.26

RUN npm ci

CMD ["npm", "run", "dev"]
