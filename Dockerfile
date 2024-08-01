# base image
FROM node:18-slim as build

ARG SENTRY_AUTH_TOKEN

RUN apt-get update && apt-get install ca-certificates nginx vim -y --no-install-recommends git


# set working directory
WORKDIR /app

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --production

# add app
COPY . /app

# generate build
RUN npm run build

############
### prod ###
############

# base image
FROM nginx

# copy artifact build from the 'build environment'
COPY --from=build /app/dist/fyle-integrations-app /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/run.sh ./

# expose port 80
EXPOSE 80

# run nginx
CMD bash run.sh
