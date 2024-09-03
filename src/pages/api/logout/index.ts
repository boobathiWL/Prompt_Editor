// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Set-Cookie", `token=; HttpOnly; Path=/; Max-Age=0`);
  res.status(200).json({ message: "Logged out successfully" });
};

export default handler;
