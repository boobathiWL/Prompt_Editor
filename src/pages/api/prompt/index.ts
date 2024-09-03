// import axios from 'axios';
import axios from "axios";

//Without stream
import authMiddleware from "@/libs/authMiddleware";
import connectMongoDB from "@/libs/connect";
import project_schema from "@/libs/models/projects";

async function handler(req, res) {
  await connectMongoDB();
  const apiUrl = process.env.CLAUDE_API_URL; // Correct API endpoint
  const apiKey = process.env.CLAUDE_API_KEY; // Ensure you have your API key in .env.local

  // Check if the request method is POST
  if (req.method === "POST") {
    const {
      prompt,
      maxTokens = 4096,
      script,
      outline,
      projectId,
      promptId,
    } = req.body; // Get prompt and maxTokens from request body

    try {
      const project = await project_schema.findById({ _id: projectId });
      if (project && !project?.script_update) {
        project.script = [script, ...project.script];
        project.outline = [outline, ...project.outline];
        project.script_update = true;
      }
      if (!project.prompt.includes(promptId)) {
        project.prompt = [...project.prompt, promptId];
      }
      await project_schema.findByIdAndUpdate({ _id: project?._id }, project);
      const response = await axios.post(
        apiUrl,

        {
          model: "claude-3-5-sonnet-20240620",
          max_tokens: maxTokens,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
        }
      );

      // Send the response data back to the client
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching data from Claude API:", error);
      res.status(500).json({ message: "Failed to fetch data" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
// export default handler;
