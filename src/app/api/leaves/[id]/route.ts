import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextResponse } from 'next/server';
type Params = {
  id: string;
};

export async function GET(req: NextApiRequest, { params }: { params: Params }) {
  const { id } = params;
  try {
    await connectMongoDB();
    const leave = await Leave.findById(id);
    if (!leave) {
      return NextResponse.json({ message: 'Leave not found' }, { status: 404 });
    }
    return NextResponse.json(leave, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch leave' }, { status: 500 });
  }
}

export async function PUT(req: NextApiRequest, { params }: { params: Params }) {
  const { id } = params;
  const { date, numberofleaves, numberofdays, dateRange, status, reason } = req.body;

  try {
    await connectMongoDB();
    const leave = await Leave.findByIdAndUpdate(id, { date, numberofleaves, numberofdays, dateRange, status, reason }, { new: true });
    if (!leave) {
      return NextResponse.json({ message: 'Leave not found' }, { status: 404 });
    }
    return NextResponse.json(leave, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update leave' }, { status: 500 });
  }
}

export async function DELETE(req: NextApiRequest, { params }: { params: Params }) {
  const { id } = params;
  try {
    await connectMongoDB();
    const deletedLeave = await Leave.findByIdAndDelete(id);
    if (!deletedLeave) {
      return NextResponse.json({ message: 'Leave not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Leave deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete leave' }, { status: 500 });
  }
}
