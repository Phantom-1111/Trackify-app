import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  description: { type: String },
  startTime:   { type: Date, required: true },
  endTime:     { type: Date },
  duration:    { type: Number, default: 0 }, // seconds
  date:        { type: String }, // "YYYY-MM-DD" for easy grouping
}, { timestamps: true });

export default mongoose.model('TimeEntry', timeEntrySchema);