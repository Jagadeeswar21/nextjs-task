import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { token } = await req.json();
  console.log(token);

  await connectMongoDB();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashedToken);

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });
  console.log(user);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  return NextResponse.json({ email: user.email }, { status: 200 });
}
