// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import Project from "@/libs/models/projects";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";

async function handler(req, res) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { project_name, script_moral } = req.body;
    const user_id = req?.user?.userId;
    
    if (!project_name || !script_moral) {
      return res.status(400).json({ message: "Required fields are required" });
    }

    const newProject = new Project({ project_name, script_moral, user_id });
    await newProject.save();

    return res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default authMiddleware(handler);
// export default handler;
