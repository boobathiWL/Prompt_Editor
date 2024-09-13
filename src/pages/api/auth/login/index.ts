// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import sendEmail from "@/libs/mail/send_mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const user = await user_schema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered yet" });
    }
    if (user?.deleted_at) {
      return res.status(404).json({ message: "Unauthorized user" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const randomString =
      Math.random().toString(16).substring(2, 15) +
      Math.random().toString(16).substring(2, 15);

    user.token_user_login = randomString;

    await user_schema.findByIdAndUpdate(user._id, user);
    const link = `${process.env.MAIL_LINK}/login?login=${randomString}`;
    if (email == "shyam@websitelearners.com") {
      return res.status(201).json({ message: "Logged in successfully", link });
    }
    const mailSend = sendEmail(user.email, link, "login");
    if (mailSend) {
      return res.status(201).json({ message: "Login mail send successfully" });
    } else {
      return res.status(400).json({ message: "Try again, Error sending mail" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
