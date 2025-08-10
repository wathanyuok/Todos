# client/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173
# ใน docker-compose เราตั้ง command ไว้อยู่แล้ว,
# แต่ใส่ CMD เผื่อไว้ให้รันเดี่ยวได้
CMD ["npm","run","dev","--","--host","0.0.0.0"]
