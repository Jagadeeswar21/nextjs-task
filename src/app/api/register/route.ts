import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
export async function POST(req:Request){
    try {
        const {name, email, password,role}=await req.json()
        console.log(name, email, password,role)
        await connectMongoDB()
         const hashedPassword=await bcrypt.hash(password,10)
        await User.create({name, email, password: hashedPassword,role})
        return NextResponse.json({message:"User Registered"},{status:201})
    } catch (error) {
        return NextResponse.json({message:"An error occurred "},{status:500})
    }

}


