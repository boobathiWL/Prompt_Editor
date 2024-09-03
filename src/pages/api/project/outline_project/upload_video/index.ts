
import fs from "fs";
import path from "path";
import multer from "multer";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import authMiddleware from "@/libs/authMiddleware";

// Initialize your Google Gemini API key and file manager
const apiKey = process.env.GEMINI_API_KEY;
const fileManager = new GoogleAIFileManager(apiKey);

// const uploadDir = path.join(process.cwd(), "uploads");
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Use original file name
    },
  }),
  limits: { fileSize: 2000 * 1024 * 1024 }, // 2GB limit
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
    sizeLimit: "2000mb", // Matches the multer limit
  },
};

const uploadToGemini = async (filePath: string, mimeType: string) => {
  try {
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: path.basename(filePath),
    });
    const file = uploadResult.file;
    return { uri: file.uri, mimeType: file.mimeType, name: file.displayName };
  } catch (error) {
    console.error("Error uploading file to Gemini:", error);
    throw new Error("Error uploading file to Gemini");
  }
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const uploadMiddleware = upload.single("file");

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error("Error processing file upload:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large" });
      }
      return res.status(500).json({ error: "Error processing file upload" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Invalid file data" });
    }

    try {
      const videoFormat = req.file.originalname.split(".").pop();
      const mimeType = `video/${videoFormat}`;
      const {
        uri,
        mimeType: geminiMimeType,
        name,
      } = await uploadToGemini(req.file.path, mimeType);
      return res.status(201).json({ uri, mimeType: geminiMimeType, name,filePath:req.file.path });
    } catch (error) {
      console.error("Error uploading video:", error);
      return res.status(500).json({ error: error.message });
    }
  });
};

export default authMiddleware(handler);

