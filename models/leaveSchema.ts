import mongoose, { Schema, Document } from "mongoose";
interface ILeave extends Document {
  date: Date;
  numberofleaves: number;
  numberofdays: number;
  dateRange: string;
  status: "pending"|"approved"|"rejected";
  reason: string;
  modifiedAt: Date;
}
const leaveSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    numberofleaves: {
      type: Number,
      required: true,
    },
    numberofdays: {
      type: Number,
      required: true,
    },
    dateRange: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending","approved","rejected"],
      default: "pending",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Leave =
  mongoose.models.Leave || mongoose.model<ILeave>("Leave", leaveSchema);
export default Leave;
