import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const leaves = await Leave.find().populate('user', 'name').exec();
    return NextResponse.json({ leaves });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ error: 'Error fetching leaves' }, { status: 500 });
  }
}
