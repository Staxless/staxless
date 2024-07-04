# Use the latest stable release of the Node.js image as the base image for the builder stage
FROM node:lts as builder
# Set the user to 'node' for better security practices
USER node
# Set the working directory to '/app' inside the container
WORKDIR /home/node/
# Copy the package.json file and change ownership to 'node' user
COPY --chown=node:node ["../package.json", "./"]
# Install the necessary packages: axios, cors, stripe, and express
RUN ["npm", "install", "axios", "cors", "stripe", "express"]
# Copy the rest of the application files and change ownership to 'node' user
COPY --chown=node:node ["../", "."] # Consider specifying specific files for better control
# Uncomment the following line if you need to clean up files, keeping only 'dist' and 'node_modules'
# RUN ["/bin/bash", "-c", "find . ! -name dist ! -name node_modules -maxdepth 1 -mindepth 1 -exec rm -rf {} \\;"]

# Create a new stage for development
FROM builder AS dev
# Install 'nodemon' for development purposes and save it as a dev dependency
RUN ["npm", "install","nodemon", "--save-dev"]
# Expose port 8003 for development
EXPOSE 8003
# Start the application in development mode using nodemon
CMD ["npm", "run", "dev"]

# Create a new stage for production
FROM node:alpine as prod
# Set the user to 'node' for better security practices
USER node
# Set the working directory to '/home/node' inside the container
WORKDIR /home/node/
# Copy the built application from the builder stage to the production stage
COPY --chown=node:node --from=builder /home/node/ ./
# Start the application in production mode
CMD ["npm", "run", "prod"]
