// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
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
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ message: "Email data empty" });
    }
    const user = await user_schema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered yet" });
    }
    const randomString =
      Math.random().toString(16).substring(2, 15) +
      Math.random().toString(16).substring(2, 15);

    user.token_reset_password = randomString;
    await user_schema.findByIdAndUpdate(user._id, user);
      const link = `${process.env.MAIL_LINK}/reset-password?reset=${randomString}`;
      const mailSend = sendEmail(user.email, link, "");
      if (mailSend) {
        return res
          .status(201)
          .json({ message: "Password reset mail send successfully" });
      } else {
        return res.status(400).json({ message: "Try again, Error sending mail" });
      }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
