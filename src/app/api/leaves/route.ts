import { connectMongoDB } from '../../../../lib/mongodb';
import Leave from '../../../../models/leaveSchema';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Notification from '../../../../models/notificationSchema';
import User from '../../../../models/schema';

async function getUser(req: NextRequest) {
  const token = await getToken({ req });
  return token;
}
export async function GET(req: NextRequest) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url as string, "http://localhost");
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const skip = (page - 1) * limit;
  try {
    const currentUser = await getUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const totalLeaves = await Leave.countDocuments({ user: currentUser.sub });
    const leaves = await Leave.find({ user: currentUser.sub }).skip(skip).limit(limit).exec();
    const totalPages = Math.ceil(totalLeaves / limit);
    return NextResponse.json({
      leaves,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ message: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, numberofdays, dateRange, status, reason } = await req.json();
    await connectMongoDB();
    const currentUser = await getUser(req);
    const newLeave = await Leave.create({
      user: currentUser?.sub,
      date,
      numberofdays,
      dateRange,
      status,
      reason
    });
    console.log(newLeave, "new leave");

    const adminsAndManagers = await User.find({ roles: { $in: ['admin', 'manager'] } });
    const adminAndManagerNotifications = adminsAndManagers.map(user => ({
      userId: user._id,
      message: `New leave request from ${currentUser?.name}`,
      sendBy: 'leave_request'
    }));

    await Notification.insertMany(adminAndManagerNotifications);
    console.log('Admin and Manager notifications created:', adminAndManagerNotifications);
    return NextResponse.json({ newLeave }, { status: 201 });
  } catch (error) {
    console.error('Error creating leave:', error);
    return NextResponse.json({ message: 'Failed to create leave' }, { status: 500 });
  }
}