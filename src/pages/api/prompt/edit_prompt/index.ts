// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import prompt_schema from "@/libs/models/prompt";
import Prompt from "@/libs/models/prompt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, content, _id } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const prompt = await prompt_schema.findById({ _id });
    if (prompt) {
      const updatePrompt = await prompt_schema.findByIdAndUpdate(
        { _id },
        { title, content }
      );
      if (updatePrompt) {
        return res.status(201).json({ message: "Prompt edited successfully" });
      }
    } else {
      return res.status(400).json({ message: "Prompt data not available" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
