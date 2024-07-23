import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();
  try {
    const rejectedCount = await Leave.countDocuments({ status: 'rejected' });
    return NextResponse.json({ count: rejectedCount });
  } catch (error) {
    console.error('Error fetching rejected leave count:', error);
    return NextResponse.json({ message: 'Failed to fetch rejected leave count' }, { status: 500 });
  }
}
