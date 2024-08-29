// pages/api/books/route.ts

import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Book from "../../../../models/bookSchema";
import { getS3FileUrl } from "../s3-upload/route";  // Adjust path as needed

export async function GET() {
  try {
    await connectMongoDB();
    
    const books = await Book.find();

    // Generate S3 URLs for each book image
    const booksWithUrls = await Promise.all(
      books.map(async (book: any) => {
        const imageUrl = await getS3FileUrl(book.imageUrl);
        return {
          title: book.title,
          price: book.price,
          imageUrl,
        };
      })
    );

    return NextResponse.json(booksWithUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Error fetching books" }, { status: 500 });
  }
}
