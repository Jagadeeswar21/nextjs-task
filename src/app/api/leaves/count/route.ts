// /app/api/leaves/count/route.ts
import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();
  try {
    const leaveCount = await Leave.countDocuments();
    return NextResponse.json({ count: leaveCount });
  } catch (error) {
    console.error('Error fetching leave count:', error);
    return NextResponse.json({ message: 'Failed to fetch leave count' }, { status: 500 });
  }
}
