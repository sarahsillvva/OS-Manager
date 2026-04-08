import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  equipment: string;
  description: string;
  status: string;
  technicianId: string;
  details: Record<string, any>; 
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  equipment: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "OPEN", enum: ["OPEN", "IN_PROGRESS", "FINISHED"] },
  technicianId: { type: String, required: true }, 
  details: { type: Object, default: {} }, 
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);