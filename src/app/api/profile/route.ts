import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

async function getUser(req: NextRequest) {
  const token = await getToken({ req });
  return token;
}
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    const user = await User.findOne({email:currentUser.email}).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
