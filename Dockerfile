FROM node:26-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV HOST=0.0.0.0
ENV PORT=3007

EXPOSE 3007

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3007"]