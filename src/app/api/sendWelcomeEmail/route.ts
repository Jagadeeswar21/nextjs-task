import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/schema";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function POST(req: Request) {
  await connectMongoDB();
  const { email } = await req.json();

  try {
    console.log(email);

    const resetUrl = `http://localhost:3000/Welcome`;

    const body = `Reset the password by clicking the following link: ${resetUrl}`;
    const msg = {
      to: email,
      from: "venugopalreddy9493@gmail.com",
      subject: "Reset Password",
      html: body,
    };
    sgMail.setApiKey("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");

    const res = await sgMail.send(msg);
    console.log(res);
    
    return NextResponse.json({ message: "mail sent" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed sending email. Try Again" },
      { status: 500 }
    );
  }
}
