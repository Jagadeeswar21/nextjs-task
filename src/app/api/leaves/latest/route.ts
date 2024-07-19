import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextResponse } from 'next/server';

export async function GET(req: any) {
  const { searchParams } = new URL(req.url as string, "http://localhost");
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  try {
    await connectMongoDB();
    const latestLeaves = await Leave.find().sort({ date: -1 }).limit(limit).populate('user', 'name').exec();
    return NextResponse.json({ leaves: latestLeaves });
  } catch (error) {
    console.error('Error fetching latest leaves:', error);
    return NextResponse.json({ message: 'Failed to fetch latest leaves', error }, { status: 500 });
  }
}
