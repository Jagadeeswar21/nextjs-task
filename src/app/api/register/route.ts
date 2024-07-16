import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, isVerified } = await req.json();
    await connectMongoDB();
    const roles = Array.isArray(role) ? role : [role];
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 3600000);
    await User.create({
      name,
      email,
      password: hashedPassword,
      roles,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });
    const verificationUrl = `http://localhost:3000/verify-email/${verificationToken}`;
    const body = `
      <p>Hi ${name},</p>
      <p>Thank you for registering on our platform. We're excited to have you with us!</p>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Account</a>
      <p>Best regards,</p>
      <p>Ahex Technologies</p>
    `;
    const msg = {
      to: email,
      from: "venugopalreddy9493@gmail.com",
      subject: "Welcome",
      html: body,
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    await sgMail.send(msg);
    return NextResponse.json(
      { message: "User Registered and verification email sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
