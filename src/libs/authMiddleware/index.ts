import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import user_schema from "../models/user";

// Function to verify JWT token
const verifyToken = (token: string | undefined) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token || "", JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

// CORS middleware
const corsMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
};

// Combined auth and CORS middleware
const authMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Run CORS middleware
    corsMiddleware(req, res, async () => {
      // Authentication logic
      const cookies = req.headers.cookie;
      const parsedCookies = cookies ? cookie.parse(cookies) : {};
      const token = parsedCookies?.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = verifyToken(token);

      const checkValidUser = await user_schema.findById({ _id: user.userId });

      if (!checkValidUser) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Attach user to the request object
      (req as any).user = user;

      // Proceed to the handler
      return handler(req, res);
    });
  };
};

export default authMiddleware;
