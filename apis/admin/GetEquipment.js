const connectDB = require("../../db/dbConnect");

async function GetAdminEquipment(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();
    const equipment = await db
      .collection("equipment")
      .aggregate([
        {
          $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category" },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Equipment fetched successfully", data: equipment });
  } catch (error) {
    console.error("admin/GetEquipment.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetAdminEquipment };
