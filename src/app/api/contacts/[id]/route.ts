import { connectMongoDB } from "../../../../../lib/mongodb";
import Contact from "../../../../../models/contactSchema";
import { NextResponse ,NextRequest} from "next/server";
import { NextApiRequest ,NextApiResponse} from "next";
type Params = {
  id: string;
};

export async function PUT(req: NextApiRequest,{ params }: { params: Params }) {
    const { id } = params;
    const { name, email, phone, status } = req.body;
  
    try {
      await connectMongoDB();
      const contact = await Contact.findByIdAndUpdate(id, { name, email, phone, status }, { new: true });
      return NextResponse.json({contact},{status:200});
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
