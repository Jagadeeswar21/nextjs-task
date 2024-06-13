import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
export async function GET(){
    await connectMongoDB()
    const users=await User.find({})
    return NextResponse.json({users})
}
