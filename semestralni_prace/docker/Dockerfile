ARG NODE_VERSION=20
ARG PORT

FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]