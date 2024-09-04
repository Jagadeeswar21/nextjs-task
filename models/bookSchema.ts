import mongoose, { Schema, model } from "mongoose";

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
  purchasedCount: { type: Number, default: 0 },
  purchasedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Book = mongoose.models.Book || model("Book", BookSchema);

export default Book;
