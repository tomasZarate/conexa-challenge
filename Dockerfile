FROM node:18.12.1

ENV CI="true"

WORKDIR /workdir

# Remove package-lock.json
RUN rm package-lock.json

# Install npm dependencies
RUN npm install

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json /workdir/

# Copy the rest of the application code
COPY . /workdir/

# Build your application
RUN npm run build

# Specify the command to run your application
CMD [ "npm", "start" ]