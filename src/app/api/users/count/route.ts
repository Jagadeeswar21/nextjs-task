// /app/api/users/count/route.ts
import { connectMongoDB } from '../../../../../lib/mongodb'; 
import User from '../../../../../models/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();
  try {
    const userCount = await User.countDocuments();
    return NextResponse.json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    return NextResponse.json({ message: 'Failed to fetch user count' }, { status: 500 });
  }
}
