### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/api-tester /usr/share/nginx/html

### STAGE 3: Live server ###
#RUN npm install -g live-server
#ENV NODE_ENV=production
#EXPOSE 3000
#CMD ["live-server", "--port=3000", "--host=0.0.0.0", "--no-browser", "--entry-file=index.html"]
