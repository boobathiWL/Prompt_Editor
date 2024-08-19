// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import Prompt from "@/libs/models/prompt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newPrompt = new Prompt({ title, content });
    await newPrompt.save();

    return res.status(201).json({ message: "Prompt created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
