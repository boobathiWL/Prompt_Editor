// import axios from 'axios';
import axios from "axios";

//Without stream


export default async function handler(req, res) {
  const apiUrl = "https://api.anthropic.com/v1/messages"; // Correct API endpoint
  const apiKey = process.env.CLAUDE_API_KEY; // Ensure you have your API key in .env.local

  // Check if the request method is POST
  if (req.method === "POST") {
    const { prompt, maxTokens = 4096 } = req.body; // Get prompt and maxTokens from request body

    try {
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
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
