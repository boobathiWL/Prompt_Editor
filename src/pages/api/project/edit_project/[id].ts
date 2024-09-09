// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";
import project_schema from "@/libs/models/projects";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { output, id, script } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const project = await project_schema.findById({ _id: id });
    if (project) {
      if (output) {
        project.output = [output, ...project.output];
      }
      if (script) {
        project.script = [script, ...project.script];
      }
    }

    const updateProject = await project_schema.findByIdAndUpdate(
      { _id: id },
      project
    );
    if (updateProject) {
      return res.status(201).json({ message: "Project edited successfully" });
    } else {
      return res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// export default handler;

export default authMiddleware(handler);
