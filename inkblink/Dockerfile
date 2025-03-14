FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./
COPY yarn.lock /app

# Install dependencies
RUN yarn install

# Copy the rest of the project files
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Start the development server
CMD ["yarn", "dev"]
