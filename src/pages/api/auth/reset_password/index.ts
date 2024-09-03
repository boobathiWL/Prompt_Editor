// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { password, reset } = req.body;
    if (!password || !reset) {
      return res.status(404).json({ message: "Try again to Reset Password" });
    }
    const user = await user_schema.findOne({ token_reset_password: reset });
    if (!user) {
      return res.status(401).json({ message: "Link expired" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.token_reset_password = "";
    user.password = hashedPassword;
    await user_schema.findByIdAndUpdate({ _id: user._id }, user);

    return res.status(201).json({ message: "Password resetted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
