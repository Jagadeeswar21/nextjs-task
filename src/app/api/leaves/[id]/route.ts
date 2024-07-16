import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextResponse } from 'next/server';
import Notification from '../../../../../models/notificationSchema';
type Params = {
  id: string;
};
async function sendNotification(userId: string, message: string, sendBy: string) {
  try {
    await Notification.create({ userId, message, read: false, sendBy });
    console.log(`Notification sent to ${userId}: ${message}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
export async function GET(req: Request, { params }: { params: Params }) {
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

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  try {
    const { date, numberofleaves, numberofdays, dateRange, status, reason } = await req.json();
    await connectMongoDB();
    const updatedLeave = await Leave.findByIdAndUpdate(id, { date, numberofleaves, numberofdays, dateRange, status, reason }, { new: true });
    console.log(updatedLeave)
    if (!updatedLeave) {
      return NextResponse.json({ message: 'Leave not found' }, { status: 404 });
    }
    await sendNotification(
      updatedLeave.user.toString(),
      `Your leave request has been ${status}`,
      'user_leave_update'
    );
    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update leave' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
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
