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
RUN npm install --omit=dev

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
# Set default GID if not provided during build
#================================================================
ARG SERVICE_GID=1001

#================================================================
# Setup non-root user and permissions
#================================================================
RUN groupadd -r -g ${SERVICE_GID} integrations_app_service && \
    useradd -r -g integrations_app_service integrations_app_user

# Set proper permissions for nginx directories and files
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    touch /var/run/nginx.pid && \
    chown -R integrations_app_user:integrations_app_service /usr/share/nginx/html && \
    chown -R integrations_app_user:integrations_app_service /var/cache/nginx && \
    chown -R integrations_app_user:integrations_app_service /var/log/nginx && \
    chown -R integrations_app_user:integrations_app_service /etc/nginx && \
    chown -R integrations_app_user:integrations_app_service /var/run/nginx.pid && \
    chown integrations_app_user:integrations_app_service /run.sh && \
    # Ensure nginx can read its configuration
    chmod -R 755 /etc/nginx && \
    # Ensure nginx can write to its cache and logs
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/log/nginx && \
    chmod -R 755 /usr/share/nginx && \
    # Ensure nginx can write to its pid file
    chmod 755 /var/run/nginx.pid

# Switch to non-root user
USER integrations_app_user

# expose port 6060
EXPOSE 6060

# run nginx
CMD bash run.sh
