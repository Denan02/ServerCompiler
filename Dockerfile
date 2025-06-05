FROM node:20-slim

# Instaliraj C++ kompajler
RUN apt-get update && apt-get install -y g++ && apt-get clean

# Radni direktorij
WORKDIR /app

# Kopiraj Node fajlove
COPY package*.json ./
RUN npm install

COPY . .

# Pokreni server
CMD ["node", "server.js"]