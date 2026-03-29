const connectDB = require("../../db/dbConnect");

async function DashboardStats(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();

    const totalUsers       = await db.collection("users").countDocuments({ role: "User" });
    const totalCategories  = await db.collection("categories").countDocuments({});
    const totalEquipment   = await db.collection("equipment").countDocuments({});
    const availableEquip   = await db.collection("equipment").countDocuments({ status: "Available" });
    const rentedEquip      = await db.collection("equipment").countDocuments({ status: "Rented" });
    const totalBookings    = await db.collection("bookings").countDocuments({});
    const pendingBookings  = await db.collection("bookings").countDocuments({ status: "Pending" });
    const approvedBookings = await db.collection("bookings").countDocuments({ status: "Approved" });
    const cancelledBookings = await db.collection("bookings").countDocuments({ status: "Cancelled" });

    // Total Revenue
    const revenueResult = await db
      .collection("payments")
      .aggregate([
        { $match: { status: "Success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Average Rating
    const ratingResult = await db
      .collection("feedbacks")
      .aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }])
      .toArray();
    const avgRating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    // Recent Bookings
    const recentBookings = await db
      .collection("bookings")
      .aggregate([
        { $sort: { created_at: -1 } },
        { $limit: 5 },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "equipment", localField: "equip_id", foreignField: "_id", as: "equipment" } },
        { $unwind: { path: "$equipment", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
      ])
      .toArray();

    // Recent Payments
    const recentPayments = await db
      .collection("payments")
      .aggregate([
        { $sort: { date: -1 } },
        { $limit: 5 },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalCategories,
        totalEquipment,
        availableEquip,
        rentedEquip,
        totalBookings,
        pendingBookings,
        approvedBookings,
        cancelledBookings,
        totalRevenue,
        avgRating,
        recentBookings,
        recentPayments,
      },
    });
  } catch (error) {
    console.error("DashboardStats.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { DashboardStats };
