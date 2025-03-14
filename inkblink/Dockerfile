FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

RUN npm install -g -s --no-progress yarn && \
    yarn && \
    yarn run build && \
    yarn cache clean

# Install dependencies
RUN yarn install

# Copy the rest of the project files
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Start the development server
CMD ["yarn", "dev"]
