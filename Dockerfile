# Use a specific Node.js version
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Command to run your app
CMD ["node", "server.js"]