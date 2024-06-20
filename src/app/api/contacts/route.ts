
import { connectMongoDB } from "../../../../lib/mongodb";
import Contact from "../../../../models/contactSchema";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

async function getCurrentUser(req:NextRequest) {
  const token = await getToken({ req });
  return token;
}
export async function GET(req:NextRequest){
    await connectMongoDB()
    const {searchParams}=new URL (req.url as string,"http://localhost")
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;
    try {
      const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
        const totalContacts = await Contact.countDocuments({createdBy:currentUser.sub});
        const contacts = await Contact.find({createdBy:currentUser.sub}).skip(skip).limit(limit).exec();
        
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
    
export async function POST(req:NextRequest){
    try{
      const data=await req.json()
    const{name,email,phone,status}=data
    console.log("Received data:", { name, email, phone, status });
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required' });
    }
    await connectMongoDB()
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const newContact=await Contact.create({name, email, phone,status, createdBy:currentUser.sub})
    console.log("Created contact:", newContact);
    return NextResponse.json({newContact},{status:201})
    }
    catch(error){
        console.log(error)
        return NextResponse.json({error:"Failed to create contact"},{status:500})
    }
}

