import mongoose, { Schema } from "mongoose";

const sharedContactSchema = new Schema(
  {
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const SharedContact = mongoose.models.SharedContact || mongoose.model("SharedContact", sharedContactSchema);
export default SharedContact;