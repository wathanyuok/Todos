import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title:    { type: String, required: true },
  dueDate:  { type: Date, required: true },        
  done:     { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
