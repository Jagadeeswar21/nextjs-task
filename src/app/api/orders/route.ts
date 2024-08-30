import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Order from "../../../../models/orderSchema";

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const body = await request.json();
    console.log('Request Body:', body); 
    const { userId, bookId, paymentId, amount } = body;
    console.log('Parsed Values:', { userId, bookId, paymentId, amount });
    if (!userId || !bookId || !paymentId || !amount) {
      return NextResponse.json(
        { error: "userId, bookId, paymentId, and amount are required" },
        { status: 400 }
      );
    }
    const newOrder = new Order({
      userId,
      bookId,
      paymentId,
      amount,
    });

    console.log('New Order:', newOrder);
    await newOrder.save();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
