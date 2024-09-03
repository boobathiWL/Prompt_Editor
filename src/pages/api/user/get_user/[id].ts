// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";
async function handler(req, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const id = req?.user?.userId;
    if (!id) {
      return res.status(400).json({ message: "Required fields empty" });
    }
    const user = await user_schema.aggregate([
      {
        $addFields: {
          user_id: { $toObjectId: id },
          role_id: { $toObjectId: "$role_id" },
        },
      },
      {
        $match: {
          $expr: {
            $eq: ["$_id", "$user_id"],
          },
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role_id",
        },
      },
      {
        $unwind: "$role_id",
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          role_name: "$role_id.role_name",
        },
      },
    ]);
    if (user) {
      return res.status(201).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// export default handler;

export default authMiddleware(handler);
