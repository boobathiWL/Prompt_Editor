// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import role_schema from "@/libs/models/role";
import type { NextApiRequest, NextApiResponse } from "next";
import Role from "@/libs/models/role";

import authMiddleware from "@/libs/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ message: "Name field is empty" });
    }
    const roleExist = await role_schema.findOne({ role_name });
    if (roleExist) {
      return res.status(400).json({ message: "role exist" });
    }

    const newRole = new Role({
      role_name,
    });

    await newRole.save();

    return res.status(201).json({ message: "Role created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default authMiddleware(handler);
// export default handler;

