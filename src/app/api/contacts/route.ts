import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb"; 

import Contact from "../../../../models/contactSchema";
import SharedContact from "../../../../models/sharedContactsSchema";
import { getToken } from "next-auth/jwt";

async function getCurrentUser(req: NextRequest) {
  const token = await getToken({ req });
  console.log(token);
  return token;
}

export async function GET(req: NextRequest) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url as string, "http://localhost");
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '1000', 10);
  
  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const ownContacts = await Contact.find({ createdBy: currentUser.sub }).exec();
    const sharedContactDocs = await SharedContact.find({ sharedWith: currentUser.sub })
      .populate('contact')
      .exec();

    const sharedContacts = sharedContactDocs.filter(doc => doc.contact)
    .map(doc => ({
      ...doc.contact.toObject(),
      sharedBy: doc.sharedBy,
      _id: doc._id
    }));
    const allContacts = [...ownContacts, ...sharedContacts];

    const totalContacts = allContacts.length;
    const totalPages = Math.ceil(totalContacts / limit);
    const paginatedContacts = allContacts.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      contacts: paginatedContacts,
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

