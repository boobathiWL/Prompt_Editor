// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import authMiddleware from "@/libs/authMiddleware";
import outline_project_schema from "@/libs/models/outline_projects";

async function handler(req, res) {
  await connectMongoDB();
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const user_id = req?.user?.userId;

    const project = await outline_project_schema.aggregate([
      {
        $addFields: {
          user: {
            $toObjectId: "$user_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          user_name: {
            $concat: ["$user.first_name", "_", "$user.last_name"],
          },
          role_id: {
            $toObjectId: "$user.role_id",
          },
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: {
          path: "$role",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          role_name: "$role.role_name",
        },
      },
      {
        $facet: {
          currentUser: [
            {
              $match: {
                user_id: user_id,
              },
            },
          ],
          otherUsers: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$role_name", "member"] },
                    { $eq: ["$role_name", "admin"] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          currentUser: 1,
          otherUsers: {
            $let: {
              vars: {
                currentUserRole: {
                  $arrayElemAt: ["$currentUser.role_name", 0],
                },
              },
              in: {
                $cond: {
                  if: {
                    $eq: ["$$currentUserRole", "super_admin"],
                  },
                  then: {
                    $filter: {
                      input: "$otherUsers",
                      as: "user",
                      cond: {
                        $or: [
                          {
                            $eq: ["$$user.role_name", "member"],
                          },
                          {
                            $eq: ["$$user.role_name", "admin"],
                          },
                        ],
                      },
                    },
                  },
                  else: {
                    $cond: {
                      if: {
                        $eq: ["$$currentUserRole", "member"],
                      },
                      then: [],
                      else: {
                        $cond: {
                          if: {
                            $eq: ["$$currentUserRole", "admin"],
                          },
                          then: {
                            $filter: {
                              input: "$otherUsers",
                              as: "user",
                              cond: {
                                $eq: ["$$user.role_name", "member"],
                              },
                            },
                          },
                          else: "$otherUsers",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          result: {
            $concatArrays: ["$currentUser", "$otherUsers"],
          },
        },
      },
      {
        $unwind: "$result",
      },
      {
        $replaceRoot: { newRoot: "$result" },
      },
      {
        $project: {
          _id: 1,
          project_name: 1,
          outline_moral: 1,
          user_id: 1,
          user_name: 1,
          role_name: 1,
          created_at: 1,
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);
    if (project) {
      return res.status(201).json({ project });
    }else{
         return res.status(404).json({message:"Project not found" });
 
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default authMiddleware(handler);
// export default handler;
