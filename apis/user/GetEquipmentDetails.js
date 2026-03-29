const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetEquipmentDetails(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid equipment ID" });
    }

    const db = await connectDB();
    const details = await db
      .collection("equipment")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category" },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    if (!details.length) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }

    return res.status(200).json({ success: true, message: "Equipment details fetched successfully", data: details[0] });
  } catch (error) {
    console.error("GetEquipmentDetails.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetEquipmentDetails };
