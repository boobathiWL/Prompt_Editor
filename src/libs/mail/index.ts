import sendEmail from "./send_mail";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, loginUrl, type } = req.body;

    try {
      await sendEmail(email, loginUrl, type);
      res.status(200).json({ message: "Login email sent successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to send email", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
