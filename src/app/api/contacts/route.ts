
import { connectMongoDB } from "../../../../lib/mongodb";
import Contact from "../../../../models/contactSchema";
import { NextResponse } from "next/server";
export async function GET(req:Request){
    await connectMongoDB()
    const {searchParams}=new URL (req.url,"http://localhost")
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;
    try {
        const totalContacts = await Contact.countDocuments();
        const contacts = await Contact.find().skip(skip).limit(limit).exec();
        
        const totalPages = Math.ceil(totalContacts / limit);
    
        return NextResponse.json({
          contacts,
          totalPages,
          currentPage: page,
        });
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
      }
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

