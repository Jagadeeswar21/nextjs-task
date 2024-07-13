import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    await connectMongoDB();
    const roles = Array.isArray(role) ? role : [role];
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, roles });
    const body = `Hi ${name},\n\nThank you for registering on our platform. We're excited to have you with us!\n\nBest regards,\n Ahex Technologies,`;
    const msg = {
      to: email,
      from: "venugopalreddy9493@gmail.com",
      subject: "Welcome ",
      text: body,
    };
    sgMail.setApiKey((process.env.SENDGRID_API_KEY as string) || "");
    await sgMail.send(msg);
    return NextResponse.json(
      { message: "User Registered and mail sent" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred " },
      { status: 500 }
    );
  }
}
