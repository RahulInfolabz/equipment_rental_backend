const connectDB = require("../../db/dbConnect");

async function GetFeedbacks(req, res) {
  try {
    const db = await connectDB();
    const feedbacks = await db
      .collection("feedbacks")
      .aggregate([
        {
          $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $lookup: { from: "equipment", localField: "service_id", foreignField: "_id", as: "equipment" },
        },
        { $unwind: { path: "$equipment", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
        { $sort: { datetime: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Feedbacks fetched successfully", data: feedbacks });
  } catch (error) {
    console.error("GetFeedbacks.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetFeedbacks };
