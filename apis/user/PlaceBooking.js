const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function PlaceBooking(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { equip_id, start_date, end_date, quantity } = req.body;

    if (!equip_id || !start_date || !end_date || !quantity) {
      return res.status(400).json({ success: false, message: "Equipment ID, start date, end date and quantity are required" });
    }

    if (!ObjectId.isValid(equip_id)) {
      return res.status(400).json({ success: false, message: "Invalid equipment ID" });
    }

    const qty = parseInt(quantity);
    if (qty < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const db = await connectDB();
    const equipCollection = db.collection("equipment");
    const bookingCollection = db.collection("bookings");

    const equipment = await equipCollection.findOne({
      _id: new ObjectId(equip_id),
      status: "Available",
    });

    if (!equipment) {
      return res.status(404).json({ success: false, message: "Equipment not found or unavailable" });
    }

    if (qty > equipment.total_qty) {
      return res.status(400).json({ success: false, message: `Only ${equipment.total_qty} unit(s) available` });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const total_amount = equipment.price * qty * rentalDays;

    await bookingCollection.insertOne({
      user_id: new ObjectId(user.session._id),
      equip_id: new ObjectId(equip_id),
      start_date: startDate,
      end_date: endDate,
      quantity: qty,
      rental_days: rentalDays,
      total_amount,
      status: "Pending",
      payment_status: "Pending",
      created_at: new Date(),
    });

    return res.status(201).json({ success: true, message: "Booking placed successfully. Awaiting admin approval." });
  } catch (error) {
    console.error("PlaceBooking.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { PlaceBooking };
