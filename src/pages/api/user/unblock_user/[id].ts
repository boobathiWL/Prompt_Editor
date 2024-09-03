// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const updateUser = await user_schema.findByIdAndUpdate(
      id,
      { $set: { deleted_at: false } },
      { new: true }
    );
    if (updateUser) {
      return res.status(201).json({ message: "User unblocked successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// export default handler;

export default authMiddleware(handler);
