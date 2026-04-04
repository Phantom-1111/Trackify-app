import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  client:      { type: String },
  description: { type: String },
  hourlyRate:  { type: Number, default: 0 },
  color:       { type: String, default: '#6C63FF' },
  status:      { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);