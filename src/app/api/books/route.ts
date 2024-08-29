import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb"; 
import Book from "../../../../models/bookSchema";

export async function GET() {
  try {
    await connectMongoDB();
    const books = await Book.find({});
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      await connectMongoDB();
      const { title, price, imageUrl } = await request.json();
  
      if (!title || !price || !imageUrl) {
        return NextResponse.json({ error: "Title, price, and image URL are required" }, { status: 400 });
      }
  
      const newBook = new Book({ title, price, imageUrl });
      await newBook.save();
  
      return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Error creating book" }, { status: 500 });
    }
  }