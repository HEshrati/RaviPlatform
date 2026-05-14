FROM node:20-alpine AS builder
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
n buiir /APP\Nenv node_env=PRODUCTION\Nrun NPM CONFIG SET REGISTRY HTTPO ./\Nrun/nEXPOSE 4000
CMD ["node", "dist/main.js"]