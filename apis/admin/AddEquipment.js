const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddEquipment(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { category_id, name, description, specification, price, total_qty } = req.body;

    if (!category_id || !name || !description || !specification || !price || !total_qty) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!ObjectId.isValid(category_id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const db = await connectDB();

    const categoryExists = await db.collection("categories").findOne({ _id: new ObjectId(category_id) });
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const image = req.file ? `/uploads/equipment/${req.file.filename}` : "";

    await db.collection("equipment").insertOne({
      category_id: new ObjectId(category_id),
      name,
      description,
      specification,
      image,
      price: parseInt(price),
      total_qty: parseInt(total_qty),
      status: "Available",
      created_at: new Date(),
    });

    return res.status(201).json({ success: true, message: "Equipment added successfully" });
  } catch (error) {
    console.error("AddEquipment.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { AddEquipment };
