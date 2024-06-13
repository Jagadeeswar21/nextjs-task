
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/schema";
import { NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const user = await User.findByIdAndUpdate(id, { status: "inactive" });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (error) {
    console.error( error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
