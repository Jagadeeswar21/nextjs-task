import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url as string, "http://localhost");
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '1000', 10);
    const totalLeaves = await Leave.countDocuments();
    const leaves = await Leave.find({}).exec();
    const totalPages = Math.ceil(totalLeaves / limit);
    return NextResponse.json({
      leaves,
      totalPages,
      currentPage: page,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ message: 'Failed to fetch leaves' }, { status: 500 });
  }
}
