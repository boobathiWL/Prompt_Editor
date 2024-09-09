// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";
import prompt_schema from "@/libs/models/prompt";
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
    const project = await prompt_schema.findByIdAndDelete({ _id: id });
    if (project) {
      return res.status(201).json({ message: "Prompt deleted successfully" });
    } else {
      return res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// export default handler;

export default authMiddleware(handler);
