import mongoose from 'mongoose';

export interface IPayment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  status?: string;
  method?: string;
  createdAt?: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  method: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPayment>('Payment', paymentSchema);