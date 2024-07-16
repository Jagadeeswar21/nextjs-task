import { connectMongoDB } from '../../../../../lib/mongodb';
import Notification from '../../../../../models/notificationSchema';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();
    
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.id;

    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: token.sub, 
    });

    if (!deletedNotification) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notification dismissed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error dismissing notification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}