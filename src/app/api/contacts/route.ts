
import { connectMongoDB } from "../../../../lib/mongodb";
import Contact from "../../../../models/contactSchema";
import { NextResponse } from "next/server";
export async function GET(){
    await connectMongoDB()
    const contacts=await Contact.find({})
    return NextResponse.json(contacts)
}

export async function POST(req:Request){
    try{
    const{name,email,phone,status}=await req.json()
    await connectMongoDB()
    const newContact=await Contact.create({name, email, phone,status})
    return NextResponse.json({newContact},{status:201})
    }
    catch(error){
        console.log(error)
    }
}