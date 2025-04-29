import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Leave from '../../../../../models/leaveSchema';


export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || '', 10);
    const year = parseInt(searchParams.get('year') || '', 10);
    const now = new Date();
    const currentYear = isNaN(year) ? now.getFullYear() : year;
    const currentMonth = isNaN(month) ? now.getMonth() : month - 1;

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const dailyLeaves = await Leave.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          leaves: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          leaves: 1
        }
      },
      {
        $sort: { day: 1 }
      }
    ]);

    const daysInMonth = endOfMonth.getDate();
    const filledDailyLeaves = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const foundDay = dailyLeaves.find(item => item.day === day);
      return foundDay || { day, leaves: 0 };
    });

    return NextResponse.json({ data: filledDailyLeaves }, { status: 200 });
  } catch (error) {
    console.error('Error fetching daily leaves:', error);
    return NextResponse.json({ error: 'Error fetching daily leaves' }, { status: 500 });
  }
}