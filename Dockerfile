FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Use wildcard to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

# For production
RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "index.js"]