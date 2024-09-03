// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import prompt_schema from "@/libs/models/prompt";
import authMiddleware from "@/libs/authMiddleware";

 async function handler(req, res) {
  await connectMongoDB();
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const prompt = await prompt_schema.find({});
    if (prompt) {
      return res.status(200).json({ prompt });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default authMiddleware(handler);
// export default handler;

