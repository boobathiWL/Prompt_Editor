// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import Outline_Project from "@/libs/models/outline_projects";
import authMiddleware from "@/libs/authMiddleware";

async function handler(req, res) {
  await connectMongoDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { project_name, outline_moral } = req.body;
    const user_id = req?.user?.userId;

    if (!project_name || !outline_moral) {
      return res.status(400).json({ message: "Required fields are required" });
    }

    const newProject = new Outline_Project({
      project_name,
      outline_moral,
      user_id,
    });
    await newProject.save();

    return res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default authMiddleware(handler);
// export default handler;
