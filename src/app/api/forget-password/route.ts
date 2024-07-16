import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
export async function POST(req: Request) {
  await connectMongoDB();
  const { email } = await req.json();
  console.log(email);
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Email doesn't exists " },
      { status: 400 }
    );
  }
  console.log(existingUser);
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log();
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetTokenExpiry = Date.now() + 3600000;
  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = resetTokenExpiry;
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  const body = `Reset the password by clicking the following link:${resetUrl}`;
  const msg = {
    to: email,
    from: "venugopalreddy9493@gmail.com",
    subject: "Reset Password",
    text: body,
  };
  sgMail.setApiKey((process.env.SENDGRID_API_KEY as string) || "");
  sgMail
    .send(msg)
    .then(() => {
      return NextResponse.json({ message: "Reset " }, { status: 200 });
    })
    .catch(async () => {
      (existingUser.resetToken = undefined),
        (existingUser.resetTokenExpiry = undefined),
        await existingUser.save();
      return NextResponse.json(
        { message: "Failed sending email..  Try Again" },
        { status: 500 }
      );
    });
  try {
    await existingUser.save();
    return NextResponse.json(
      { message: "email is sent to reset the password" },
      { status: 200 }
    );
  } catch (error) {
    console.error("", error);
    return NextResponse.json({ message: "Failed to SEND" }, { status: 500 });
  }
}
