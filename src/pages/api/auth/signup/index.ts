// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/libs/models/user";
import role_schema from "@/libs/models/role";
import Role from "@/libs/models/role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const emailExist = await user_schema.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "User exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const getRoleMember = await role_schema.findOne({ role_name: "member" });
    let role_id = "";
    if (getRoleMember) {
      role_id = getRoleMember._id;
    } else {
      const createRole = await new Role({ role_name: "member" });
      const role = await createRole.save();
      role_id = role._id;
    }
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
