import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project:    { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  period:     { type: String }, // e.g. "2024-W12" or "2024-04" or "2024-04-01"
  periodType: { type: String, enum: ['daily', 'weekly', 'monthly'] },
  totalHours: { type: Number },
  totalAmount:{ type: Number },
  entries:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeEntry' }],
  status:     { type: String, enum: ['draft', 'sent', 'paid'], default: 'draft' },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);