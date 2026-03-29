const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetEquipment(req, res) {
  try {
    const { category_id, min_price, max_price } = req.query;

    const db = await connectDB();
    const matchStage = { status: "Available" };

    if (category_id && ObjectId.isValid(category_id)) {
      matchStage.category_id = new ObjectId(category_id);
    }

    if (min_price || max_price) {
      matchStage.price = {};
      if (min_price) matchStage.price.$gte = parseFloat(min_price);
      if (max_price) matchStage.price.$lte = parseFloat(max_price);
    }

    const equipment = await db
      .collection("equipment")
      .aggregate([
        { $match: matchStage },
        {
          $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category" },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Equipment fetched successfully", data: equipment });
  } catch (error) {
    console.error("GetEquipment.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetEquipment };
