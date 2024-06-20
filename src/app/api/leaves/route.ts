import { connectMongoDB } from '../../../../lib/mongodb';
import Leave from '../../../../models/leaveSchema';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function getUser(req: NextRequest) {
  const token = await getToken({ req });
  return token;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const currentUser = await getUser(req);
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const leaves = await Leave.find({ user: currentUser.sub });
    console.log(leaves);
    return NextResponse.json(leaves, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ message: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, numberofleaves, numberofdays, dateRange, status, reason } = await req.json();
    await connectMongoDB();
    const currentUser = await getUser(req);
    const newLeave = await Leave.create({
      user: currentUser?.sub,
      date,
      numberofleaves,
      numberofdays,
      dateRange,
      status,
      reason
    });
    console.log(newLeave, "new leave");
    return NextResponse.json({ newLeave }, { status: 201 });
  } catch (error) {
    console.error('Error creating leave:', error);
    return NextResponse.json({ message: 'Failed to create leave' }, { status: 500 });
  }
}
