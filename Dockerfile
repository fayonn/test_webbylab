FROM node:16
LABEL authors="Sviatoslav"

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig.json ./

RUN npm install

COPY envs ./envs
COPY src ./src
COPY dist ./dist

CMD ["npm", "start"]