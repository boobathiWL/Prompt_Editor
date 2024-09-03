// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import project_schema from "@/libs/models/projects";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const project = await project_schema.findById({ _id: id });
    if (project) {
      return res.status(201).json({ project });
    } else {
      return res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// export default handler;

export default authMiddleware(handler);
