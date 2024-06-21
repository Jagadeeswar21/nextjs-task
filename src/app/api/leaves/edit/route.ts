import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
    try {
      await connectMongoDB();
      const leaves = await Leave.find({ });
      console.log(leaves);
      return NextResponse.json(leaves, { status: 200 });
    } catch (error) {
      console.error('Error fetching leaves:', error);
      return NextResponse.json({ message: 'Failed to fetch leaves' }, { status: 500 });
    }
  }