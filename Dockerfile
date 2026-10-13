FROM node:22-bookworm-slim
WORKDIR /opt/keyholder
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
