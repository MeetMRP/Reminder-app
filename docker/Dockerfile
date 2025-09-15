# Use a specific version of Node.js for reproducibility
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /home/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["node", "app.js"]
