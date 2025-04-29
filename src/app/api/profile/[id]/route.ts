import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/schema";
import { NextResponse, NextRequest } from "next/server";
import multer from 'multer';
import { promisify } from 'util';
import path from 'path';
import { getToken } from "next-auth/jwt";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
      cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Images Only! Supported formats are jpeg,png,jpg"));
  }
});
const multerUpload = promisify(upload.single('profilePicture'));
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    await multerUpload(req as any, {} as any)
    await connectMongoDB();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const gender = formData.get('gender') as string;
    const mobileNumber = formData.get('mobileNumber') as string;
    const profilePicture = formData.get('profilePicture') as File;

    const updateData: any = {
      name,
      dateOfBirth,
      gender,
      mobileNumber,
      modifiedAt: new Date()
    };

    if (profilePicture) {
      if (profilePicture.size > MAX_FILE_SIZE) {
        throw new Error("Error: File size exceeds the limit of 5MB.");
      }
      const profilePicturePath = `/uploads/profile-${Date.now()}${path.extname(profilePicture.name)}`;
      updateData.profilePicture = profilePicturePath;
      const buffer = await profilePicture.arrayBuffer();
      const fs = require('fs');
      fs.writeFileSync(`./public${profilePicturePath}`, Buffer.from(buffer));
    }

    const user = await User.findOneAndUpdate({ email: token.email }, updateData, { new: true }).select('-password');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated", user }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error && error.message.includes("Images Only")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
