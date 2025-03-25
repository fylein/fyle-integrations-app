# base image
FROM node:22-slim as build

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

#================================================================
# Setup non-root user and permissions
#================================================================
RUN groupadd -r -g 1001 integrations_app_service && \
    useradd -r -g integrations_app_service integrations_app_user && \
    chown -R integrations_app_user:integrations_app_service /usr/share/nginx/html /etc/nginx/nginx.conf /run.sh

# Switch to non-root user
USER integrations_app_user

# expose port 6060
EXPOSE 6060

# run nginx
CMD bash run.sh
