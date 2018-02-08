FROM node:latest
MAINTAINER Alexander Y Lyapko box@sunsay.ru
RUN mkdir -p /opt/keyholder
COPY . /opt/keyholder
WORKDIR /opt/keyholder
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
