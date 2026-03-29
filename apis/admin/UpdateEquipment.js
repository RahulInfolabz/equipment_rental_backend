const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateEquipment(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id, category_id, name, description, specification, price, total_qty, status } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid equipment ID is required" });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (category_id && ObjectId.isValid(category_id)) updateFields.category_id = new ObjectId(category_id);
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (specification) updateFields.specification = specification;
    if (price) updateFields.price = parseInt(price);
    if (total_qty) updateFields.total_qty = parseInt(total_qty);
    if (status) updateFields.status = status;
    if (req.file) updateFields.image = `/uploads/equipment/${req.file.filename}`;

    const result = await db
      .collection("equipment")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }

    return res.status(200).json({ success: true, message: "Equipment updated successfully" });
  } catch (error) {
    console.error("UpdateEquipment.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateEquipment };
