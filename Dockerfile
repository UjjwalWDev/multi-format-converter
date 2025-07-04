# Use official Node.js LTS base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install required system packages
RUN apt-get update && apt-get install -y \
    libreoffice \
    ffmpeg \
    poppler-utils \
    unrar \
    wget \
    gnupg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Calibre (for ebook-convert)
RUN wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sh /dev/stdin

# Copy source code
COPY . .

# Create required directories if not exist
RUN mkdir -p /app/uploads /app/converted /app/extracted /app/outputs

# Expose the port
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
