import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();
  try {
    const approvedCount = await Leave.countDocuments({ status: 'approved' });
    return NextResponse.json({ count: approvedCount });
  } catch (error) {
    console.error('Error fetching approved leave count:', error);
    return NextResponse.json({ message: 'Failed to fetch approved leave count' }, { status: 500 });
  }
}
