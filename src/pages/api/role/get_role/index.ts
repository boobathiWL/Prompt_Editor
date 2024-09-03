// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import role_schema from "@/libs/models/role";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";
 async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const role = await role_schema.find({});
    return res.status(201).json({ role });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default authMiddleware(handler);
// export default handler;

