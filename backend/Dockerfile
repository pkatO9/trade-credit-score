FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build request
RUN npm run build

# Expose port
EXPOSE 3000

# Start in dev mode (overridden by compose usually, but good default)
CMD ["npm", "run", "start:dev"]
