import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
export async function POST(req:Request){
    try {
        await connectMongoDB()
        const {email}=await req.json()
        console.log(email,"email")
       let user= await User.findOne({email}).select('_id')
       console.log(user,"user")
        return NextResponse.json({user})
    } catch (error) {
        return NextResponse.json({message:"An error occurred "},{status:500})
    }

}
