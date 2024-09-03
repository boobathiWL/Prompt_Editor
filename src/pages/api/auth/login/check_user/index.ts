// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongoDB from "@/libs/connect";
import user_schema from "@/libs/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();
  async function getUserDetail(login) {
    const userDetail = await user_schema.aggregate([
      {
        $match: {
          token_user_login: login,
        },
      },
      {
        $addFields: {
          role_id: { $toObjectId: "$role_id" }, // Convert the string role_id to ObjectId
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
        },
      },
    ]);
    // Convert _id from string to ObjectId
    const output = userDetail.map((user) => ({
      ...user,
      _id: new mongoose.Types.ObjectId(user._id),
    }));
    return output[0];
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { login } = req.body;
    if (!login) {
      return res.status(404).json({ message: "Try again to login" });
    }
    const userStatus = await user_schema.findOne({ token_user_login: login });
    if (userStatus?.deleted_at) {
      return res.status(404).json({ message: "Unauthorized user" });
    }

    const user = await getUserDetail(login);
    // await user_schema.findOne({ token_user_login: login });
    if (!user) {
      return res.status(401).json({ message: "Link expired" });
    }
    user.token_user_login = "";
    await user_schema.findByIdAndUpdate({ _id: user._id }, user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript in the browser
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "strict", // Prevents CSRF attacks
        path: "/", // Cookie is accessible on all routes
      })
    );

    return res.status(201).json({ message: "Logged in successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
