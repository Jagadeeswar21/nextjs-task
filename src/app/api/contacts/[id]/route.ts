import { connectMongoDB } from "../../../../../lib/mongodb";
import Contact from "../../../../../models/contactSchema";
import { NextResponse} from "next/server";
import SharedContact from "../../../../../models/sharedContactsSchema";
type Params = {
  id: string;
};
export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const { name, email, phone, status } = await req.json();
  
  await connectMongoDB();

  try {
    let updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone, status }, { new: true });
    if (!updatedContact) {
      const sharedContact = await SharedContact.findById(id).populate('contact');
      if (sharedContact) {
        updatedContact = await Contact.findByIdAndUpdate(sharedContact.contact._id, { name, email, phone, status }, { new: true });
      }
    }

    if (updatedContact) {
      return NextResponse.json(updatedContact, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update contact', error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;

  await connectMongoDB();
  try {
    let deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      const sharedContact = await SharedContact.findByIdAndDelete(id);
      if (sharedContact) {
        return NextResponse.json({ message: 'Shared contact deleted successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete contact', error }, { status: 500 });
  }
}
