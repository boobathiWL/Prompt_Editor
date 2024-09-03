// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/libs/models/user";
import role_schema from "@/libs/models/role";
import authMiddleware from "@/libs/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { first_name, last_name, email, password, role_name } = req.body;

    if (!first_name || !last_name || !email || !password || !role_name) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const emailExist = await user_schema.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "User exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const getRoleMember = await role_schema.findOne({ role_name });
    let role_id = getRoleMember._id;
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id,
    });

    await newUser.save();

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default authMiddleware(handler);
// export default handler;
