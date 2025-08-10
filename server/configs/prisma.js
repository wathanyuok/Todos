import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_db';
mongoose.connect(uri).then(()=>console.log('Mongo connected')).catch(console.error);
