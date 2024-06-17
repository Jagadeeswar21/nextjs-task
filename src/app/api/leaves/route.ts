import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongoDB } from '../../../../lib/mongodb';
import Leave from '../../../../models/leaveSchema';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectMongoDB();
    const leaves = await Leave.find({});
    console.log(leaves);
    return NextResponse.json(leaves, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function POST(req:Request){
    try{
    const{date, numberofleaves, numberofdays, dateRange, status, reason }=await req.json()
    await connectMongoDB()
    const newLeave=await Leave.create({date, numberofleaves, numberofdays, dateRange, status, reason })
    console.log(newLeave,"newleave");
    return NextResponse.json({newLeave},{status:201})
    }
    catch(error){
        console.log(error)
    }
}