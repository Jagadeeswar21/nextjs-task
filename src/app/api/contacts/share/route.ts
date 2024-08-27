import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Contact from "../../../../../models/contactSchema";
import User from "../../../../../models/schema";
import SharedContact from "../../../../../models/sharedContactsSchema";
import { getToken } from "next-auth/jwt";

async function getCurrentUser(req: NextRequest) {
  const token = await getToken({ req });
  return token;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId, receiverEmail } = await req.json();

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      return NextResponse.json({ message: 'Receiver not found. Please register.' }, { status: 404 });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json({ message: 'Contact already exists' }, { status: 404 });
    }

    const sharedContact = await SharedContact.findOne({
      contact: contactId,
      sharedBy: currentUser.sub,
    });

    if (sharedContact) {
      let sharedWithArray = sharedContact.sharedWith;
      if (!Array.isArray(sharedWithArray)) {
        sharedWithArray = [];
      }

      if (sharedWithArray.includes(receiver._id)) {
        return NextResponse.json({ message: 'Contact already shared with this user' }, { status: 400 });
      }
      sharedWithArray.push(receiver._id);
      sharedContact.sharedWith = sharedWithArray;
      await sharedContact.save();
      return NextResponse.json({ message: 'Contact shared successfully' }, { status: 200 });
    } else {
      const newSharedContact = new SharedContact({
        contact: contactId,
        sharedBy: currentUser.sub,
        sharedWith: [receiver._id], 
      });

      await newSharedContact.save();
      return NextResponse.json({ message: 'Contact shared successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error sharing contact:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
