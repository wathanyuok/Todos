# 📌 Todos Project

โปรเจกต์นี้เป็นระบบ **Todo List** ที่แยก Frontend และ Backend ชัดเจน พร้อมรันผ่าน **Docker Compose** ได้ทันที

---

## 🚀 การรันโปรเจกต์

### 1. รันด้วย Docker Compose
```bash
docker compose up -d --build
```
Docker จะสร้างและรันบริการดังนี้:

| Service  | Port Local | Description | URL (ตอนรันเสร็จ) |
|----------|-----------|-------------|--------------------|
| **Frontend** | `5173`     | React/Vite | [http://localhost:5173](http://localhost:5173) |
| **Backend**  | `4000`     | Node.js API | [http://localhost:4000/api](http://localhost:4000/api) |
| **MongoDB**  | `27017`    | Database   | ใช้ MongoDB Compass หรือ CLI เชื่อมต่อได้ |

---

### 2. รันแบบ Manual (ไม่ใช้ Docker)
#### Backend
```bash
cd server
npm install
npm run dev  # หรือ npm start
```
- URL: `http://localhost:4000/api`

#### Frontend
```bash
cd client
npm install
npm run dev
```
- URL: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=4000
MONGO_URI=mongodb://mongo:27017/todos
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 📝 Notes
- ใช้ **MongoDB 7** และรันในโหมด Replica Set (`rs0`) เพื่อรองรับ Transaction
- Frontend และ Backend สามารถสื่อสารกันผ่าน Docker network ได้โดยใช้ชื่อ service (`server`, `mongo`)
- ถ้าต้องการหยุด container:  
  ```bash
  docker compose down
  ```

