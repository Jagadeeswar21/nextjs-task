import { connectMongoDB } from '../../../../lib/mongodb';
import Notification from '../../../../models/notificationSchema';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const dynamic = "force-dynamic";

async function getUser(req: NextRequest) {
    const token = await getToken({ req });
    return token;
}

export async function GET(req: NextRequest) {
    await connectMongoDB();
    try {
        const currentUser = await getUser(req);
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const notifications = await Notification.find({ userId: currentUser.sub })
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();
        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 });
    }
}
export async function PUT(req: NextRequest) {
    try {
        const { ids } = await req.json();
        await connectMongoDB();
        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'Invalid or empty ids array' }, { status: 400 });
        }
        const updateResult = await Notification.updateMany(
            { _id: { $in: ids } },
            { $set: { read: true } }
        );
        console.log('Update result:', updateResult);

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ message: 'No notifications found to update' }, { status: 404 });
        }

        return NextResponse.json({
            message: `${updateResult.modifiedCount} notifications marked as read`,
            updatedCount: updateResult.modifiedCount
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ message: 'Failed to update notifications' }, { status: 500 });
    }
}