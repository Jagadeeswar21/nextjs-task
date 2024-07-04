import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import crypto from 'crypto'
export async function POST(req:Request){
        await connectMongoDB()
        const {email}=await req.json()
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return NextResponse.json({message:"Email doesn't exists "},{status:400})
        }
        const resetToken =crypto.randomBytes(32).toString('hex');
        const passwordResetToken=crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

        const resetTokenExpiry = Date.now() + 3600000;

        existingUser.resetToken = passwordResetToken;
        existingUser.resetTokenExpiry = resetTokenExpiry;
        const resetUrl="localhost:3000/reset-password/${resetToken}"

        console.log(resetUrl)
} 