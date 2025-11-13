# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (only production)
RUN npm ci --only=production

# Copy the rest of your backend code
COPY . .

# Expose your backend port (adjust if you use a different one)
EXPOSE 5000

# Start your backend server
CMD ["node", "server/server.js"]
