import connectMongoDB from "@/libs/connect";
import outline_project_schema from "@/libs/models/outline_projects";
import authMiddleware from "@/libs/authMiddleware";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";

// Setup multer for handling file uploads
const upload = multer({ dest: "uploads/" }); // Directory to temporarily store uploaded files

async function handler(req, res) {
  await connectMongoDB();

  const apiKey = process.env.GEMINI_API_KEY; // Ensure you have your API key in .env.local
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODAL, // Specify the model version
  });

  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to upload file" });
      }

      const { uri, mimeType, filePath, prompt, promptId, projectId, name } =
        req.body;
      try {
        //  Generate content based on the prompt and the uploaded video
        const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        };
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [{ text: "what do you see in this video?" }],
            },
            {
              role: "user",
              parts: [
                {
                  fileData: {
                    mimeType: mimeType,
                    fileUri: String(uri),
                  },
                },
              ],
            },
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        });

        const result: any = await chatSession.sendMessage(prompt);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the file if it exists
        }
        const outline = result?.response?.candidates[0].content.parts[0].text;
        const project = await outline_project_schema.findById(projectId);
        if (!project.prompt.includes(promptId)) {
          project.prompt = [...project.prompt, promptId];
        }
        if (outline) {
          project.output = [outline, ...project.output];
        }
        await outline_project_schema.findByIdAndUpdate(projectId, project);
        //  Return the generated content to the client
        res.status(201).json({ outline: result });
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Try again, 10 seconds later" });
      }
    });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
