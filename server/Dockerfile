# ใช้ Node LTS
FROM node:20-alpine

WORKDIR /app

# คัดลอกไฟล์ที่จำเป็นก่อนเพื่อลด layer invalidation
COPY package*.json ./
RUN npm ci --only=production

# คัดลอกโค้ดที่เหลือ
COPY . .

# ให้ Prisma client ถูก generate ตั้งแต่ใน image
# (สำคัญ: ต้องมี prisma/schema.prisma อยู่แล้วใน WORKDIR)
RUN npx prisma generate

# เปิดพอร์ตแอป
EXPOSE 5500

# รันแอป
CMD ["node", "index.js"]
