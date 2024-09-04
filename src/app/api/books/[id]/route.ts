import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Book from "../../../../../models/bookSchema";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    const bookId = params.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    book.purchasedCount += 1;
    await book.save();

    return NextResponse.json(
      { message: "Purchased count incremented" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error incrementing purchased count" },
      { status: 500 }
    );
  }
}
