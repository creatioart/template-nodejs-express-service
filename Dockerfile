#
#--------------------------------------------------------------------------
# Image Setup
#--------------------------------------------------------------------------

# ---- Package Builder -----
# Use the official lightweight Node.js 18 image. https://hub.docker.com/_/node
FROM node:20-alpine AS package-builder

LABEL maintainer="CreatioART - CreatioART Support <support@creatioart.com>"

# Create and change to the app directory.
WORKDIR /usr/app

USER root

# Set the timezone
RUN echo "America/Santiago" > /etc/timezone

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Copy npm manifests to the container image.
COPY .npm* ./

# All the steps until here can be re-used in the second stage,
RUN npm install

# Copy local code to the container image.
COPY . ./

# Compile project.
RUN npm run build

# Use the official lightweight Node.js 18 image. https://hub.docker.com/_/node
FROM node:20-alpine

# update packages (Enable only if additional packages need to be installed)
#RUN apk update

# Set the timezone
RUN echo "America/Santiago" > /etc/timezone

# Create and change to the app directory.
WORKDIR /usr/app

# Add envs
ENV PORT="8080"

USER root

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Copy npm manifests to the container image.
COPY .npm* ./

# Install only production dependencies.
RUN npm install --save-prod

# Copy local compiled code to the container image.
COPY --from=package-builder /usr/app/build/ ./build/

# Copy local langs to the container image.
COPY ./locales/compiled/ ./locales/compiled/

# Copy to the container image.
COPY . ./

# Clean up
RUN rm -rf /var/cache/apk/* && \
    rm -rf /usr/app/src/* /usr/app/src /tmp/* /var/tmp/* && \
    rm -rf /var/log/*

# Set non-root user
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /usr/app
USER app

EXPOSE 8080

# Run the web service on container startup.
CMD [ "npm", "start" ]