# 📌 Todos Project

โปรเจกต์นี้เป็นระบบ **Todo List** ที่แยก Frontend และ Backend ชัดเจน รันได้ทั้ง **Docker Compose** และ **Manual**

---

## 🚀 การรันโปรเจกต์

### 1) รันด้วย Docker Compose
```bash
docker compose up -d --build
```

**Services & Ports (Host → Container):**

| Service    | Host Port | Container Port | Description    | URL (ตอนรันเสร็จ)                 |
|------------|-----------|----------------|----------------|------------------------------------|
| Frontend   | 5173      | 5173           | React/Vite     | http://localhost:5173              |
| Backend    | 5600      | 5500           | Node.js API    | http://localhost:5600/api          |
| MongoDB    | 27017     | 27017          | Database       | ใช้ Compass: mongodb://localhost:27017 |

> หมายเหตุ: ต้องมี mapping ใน `docker-compose.yml` ประมาณนี้สำหรับ backend:  
> `ports: ["5600:5500"]` และในคอนเทนเนอร์ตั้ง `PORT=5500`

---

### 2) รันแบบ Manual (ไม่ใช้ Docker)
#### Backend
```bash
cd server
npm install
npm run dev    # ให้เปิดที่พอร์ต 5500
```
- URL: `http://localhost:5500/api`

#### Frontend
```bash
cd client
npm install
npm run dev
```
- URL: `http://localhost:5173`

---

## 🔑 Environment Variables

### เมื่อรันด้วย **Docker** (`server/.env`)
```env
PORT=5500
MONGO_URI=mongodb://mongo:27017/todos
CLIENT_ORIGIN=http://localhost:5173
```

### เมื่อรันแบบ **Manual** บนเครื่อง
```env
# server/.env
PORT=5500
MONGO_URI=mongodb://localhost:27017/todos
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`client/.env`)
```env
# ถ้าใช้ Docker
VITE_API_URL=http://localhost:5600/api

# ถ้า Manual
# VITE_API_URL=http://localhost:5500/api
```

---

## 📝 Notes
- ใช้ **MongoDB 7** และรันในโหมด Replica Set (`rs0`) เพื่อรองรับ Transaction
- Frontend และ Backend สามารถสื่อสารกันผ่าน Docker network ได้โดยใช้ชื่อ service (`server`, `mongo`)
- ถ้าต้องการหยุด container:  
  ```bash
  docker compose down
  ```

---
