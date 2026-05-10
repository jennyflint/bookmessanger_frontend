FROM node:26-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npx nuxi prepare

EXPOSE 3007

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3007"]