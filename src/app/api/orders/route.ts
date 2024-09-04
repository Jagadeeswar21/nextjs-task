import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb"; // Adjust the path as needed
import Order from "../../../../models/orderSchema"; // Adjust the path as needed
import Book from "../../../../models/bookSchema"; // Adjust the path as needed
import User from "../../../../models/schema"; // Ensure correct path to the User model
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

async function getUser(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      console.error("Token not found in request:", request);
      return null;
    }
    console.log("Token retrieved:", token);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET endpoint called");
    await connectMongoDB();
    
    const currentUser = await getUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders for the current user
    const orders = await Order.find({ userId: currentUser.sub }).populate("bookId");
    console.log("Orders Found:", orders);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
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
    console.log("Request Body:", body);

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    console.log("Book Found:", book);

    // Create a new order
    const newOrder = new Order({
      userId: currentUser.sub,
      bookId,
      paymentId,
      amount,
    });
    console.log("New Order:", newOrder);

    await newOrder.save();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
