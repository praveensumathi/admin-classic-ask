FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm ci -f
COPY . .
EXPOSE 5173
ENV VITE_AXIOS_BASE_URL=http://api.devnksadmin.shop/
CMD ["npm", "run","dev"]