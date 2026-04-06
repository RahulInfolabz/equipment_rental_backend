const connectDB = require("../../db/dbConnect");
async function GetAdminEquipment(req, res) {
  try {
    const db = await connectDB();
    const equipment = await db.collection("equipment").aggregate([
      { $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Equipment fetched successfully", data: equipment });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminEquipment };
