import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/schema";
import { NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const {  status } = await req.json();
    await connectMongoDB();
    const user = await User.findByIdAndUpdate(id, {  status }, { new: true });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User details updated", user }, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error( error)
    return NextResponse.json({ error: "Internal Server Error" }, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
