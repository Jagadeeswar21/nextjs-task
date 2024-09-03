import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Order from "../../../../models/orderSchema";
import Book from "../../../../models/bookSchema";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

async function getUser(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      console.error("Token not found in request:", request);
    } else {
      console.log("Token retrieved:", token);
    }
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST endpoint called");
    await connectMongoDB();
    const currentUser = await getUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { bookId, paymentId, amount } = body;

    if (!bookId || !paymentId || !amount) {
      return NextResponse.json(
        { error: "bookId, paymentId, and amount are required" },
        { status: 400 }
      );
    }
    console.log(body)

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    console.log(book)

    const newOrder = new Order({
      userId: currentUser.sub,
      bookId,
      paymentId,
      amount,
    });
    console.log(newOrder)

    await newOrder.save();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
