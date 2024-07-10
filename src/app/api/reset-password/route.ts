import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { password, email } = await req.json();
  console.log("Email received:", email);
  await connectMongoDB();
  const existingUser = await User.findOne({ email });
  console.log("Existing user:", existingUser);
  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  existingUser.password = hashedPassword;
  existingUser.resetToken = undefined;
  existingUser.resetTokenExpiry = undefined;

  try {
    await existingUser.save();
    return NextResponse.json(
      { message: "Password has been updated" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
