FROM node:18

WORKDIR /src

# Install Chrome dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm ci && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Expose port (Railway will set PORT env var, but we expose common ports)
EXPOSE 3000 8000

# Use the PORT environment variable or default to Railway's expected port
CMD ["npm", "run", "prod"]