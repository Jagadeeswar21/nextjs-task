import { connectMongoDB } from "../../../../../lib/mongodb";
import Contact from "../../../../../models/contactSchema";
import { NextResponse} from "next/server";

type Params = {
  id: string;
};

export async function PUT(req:Request,{ params }: { params: Params }) {
    const { id } = params;
    try {
    const { name, email, phone, status } =await req.json();
      await connectMongoDB();
      const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone, status }, { new: true });
      return NextResponse.json(updatedContact,{status:200});
    } catch (error) {
      return NextResponse.json({ message: 'Failed to update contact' },{status:500});
    }
  }

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;
  await connectMongoDB();
      try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
          return NextResponse.json({ message: 'Contact not found' },{status:404});
        }
        return NextResponse.json({ message: 'Contact deleted successfully' },{status:200});
      } catch (error) {
        return NextResponse.json({ message: 'Failed to delete contact', error });
      }
}
