import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/libs/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userDetail = await user_schema.aggregate([
      {
        $addFields: {
          role_id: { $toObjectId: "$role_id" },
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
        $unwind: {
          path: "$role_id",
        },
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          role_name: "$role_id.role_name",
          deleted_at: 1,
        },
      },
      {
        $match: {
          role_name: { $ne: "super_admin" },
        },
      },
    ]);
    // const userDetail=await user_schema.find({})
    return res.status(201).json(userDetail);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
export default authMiddleware(handler);
// export default handler;
