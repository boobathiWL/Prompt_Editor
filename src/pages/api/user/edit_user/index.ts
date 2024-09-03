// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import role_schema from "@/libs/models/role";
import authMiddleware from "@/libs/authMiddleware";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { first_name, last_name, email, role_name, id } = req.body;

    if (!first_name || !last_name || !email || !role_name) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const getRoleMember = await role_schema.findOne({ role_name });
    let role_id = getRoleMember._id;
    const updateUser = await user_schema.findByIdAndUpdate(
      { _id: id },
      {
        first_name,
        last_name,
        email,
        role_id,
      }
    );
    if (updateUser) {
      return res.status(201).json({ message: "User edited successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// export default handler;

export default authMiddleware(handler);
