import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';
import moment from 'moment';

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const leaves = await Leave.find().populate('user', 'name').exec();
    const transformedLeaves = leaves.map((leave) => {
      const [startDate, endDate] = leave.dateRange.split(' - ');
      return {
        ...leave.toObject(),
        startDate: moment(startDate, 'YYYY-MM-DD').toDate(),
        endDate: moment(endDate, 'YYYY-MM-DD').toDate(),
      };
    });

    return NextResponse.json({ leaves: transformedLeaves });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ error: 'Error fetching leaves' }, { status: 500 });
  }
}