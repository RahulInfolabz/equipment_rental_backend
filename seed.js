const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "equipment_rental";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  await db.collection("users").deleteMany({});
  await db.collection("categories").deleteMany({});
  await db.collection("equipment").deleteMany({});
  await db.collection("bookings").deleteMany({});
  await db.collection("payments").deleteMany({});
  await db.collection("feedbacks").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      name: "Admin User",
      email: "admin@equipment.com",
      phone: "9900000001",
      password: "Admin@123",
      profile_image: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Karan Desai",
      email: "karan@gmail.com",
      phone: "9900000002",
      password: "Karan@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "9900000003",
      password: "Sneha@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Categories ────────────────────────────────────────────────────────────
  const categoriesResult = await db.collection("categories").insertMany([
    { name: "Camera & Photography", image: "", status: "Active", created_at: new Date() },
    { name: "Audio & Sound", image: "", status: "Active", created_at: new Date() },
    { name: "Lighting Equipment", image: "", status: "Active", created_at: new Date() },
    { name: "Construction Tools", image: "", status: "Active", created_at: new Date() },
    { name: "Medical Equipment", image: "", status: "Active", created_at: new Date() },
    { name: "Event Equipment", image: "", status: "Active", created_at: new Date() },
  ]);

  const categoryIds = Object.values(categoriesResult.insertedIds);
  console.log("✅ Categories seeded");

  // ── Equipment ─────────────────────────────────────────────────────────────
  const equipmentResult = await db.collection("equipment").insertMany([
    {
      category_id: categoryIds[0],
      name: "DSLR Camera - Canon EOS 90D",
      description: "High-quality DSLR camera perfect for photography and videography projects.",
      specification: "32.5MP, 4K Video, ISO 100-25600, Wi-Fi, Dual Pixel CMOS AF",
      image: "",
      price: 800,
      total_qty: 5,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      name: "DJI Drone - Phantom 4 Pro",
      description: "Professional drone with 4K camera for aerial photography and surveying.",
      specification: "4K 60fps, 3-axis Gimbal, 30min flight time, 7km range, Obstacle Sensing",
      image: "",
      price: 1500,
      total_qty: 3,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      name: "Professional PA Speaker System",
      description: "High-power PA speaker system suitable for events, concerts, and conferences.",
      specification: "2000W RMS, 15-inch woofer, Bluetooth, USB/SD, 20Hz-20kHz frequency",
      image: "",
      price: 600,
      total_qty: 8,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      name: "Digital Mixing Console - Yamaha MG16",
      description: "16-channel digital mixing console for professional audio mixing.",
      specification: "16 channels, 4 bus, USB recording, D-PRE preamps, SPX effects",
      image: "",
      price: 900,
      total_qty: 4,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2],
      name: "LED Studio Light Kit (3-Panel)",
      description: "Professional 3-panel LED studio lighting kit for photography and video shoots.",
      specification: "3x 200W LED panels, 5500K daylight, softboxes included, adjustable stand",
      image: "",
      price: 500,
      total_qty: 6,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[3],
      name: "Concrete Drill Machine (Rotary Hammer)",
      description: "Heavy-duty rotary hammer drill for concrete, brick, and masonry work.",
      specification: "1500W, SDS-Plus, 3-mode operation, 0-1000 RPM, anti-vibration handle",
      image: "",
      price: 400,
      total_qty: 10,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[3],
      name: "Scaffolding Set (3-Level)",
      description: "Heavy-duty aluminum scaffolding set for construction and maintenance work.",
      specification: "3-level, height up to 6m, 270kg load capacity, wheels included",
      image: "",
      price: 700,
      total_qty: 5,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[5],
      name: "Projector - Epson Full HD",
      description: "Full HD projector for corporate events, presentations, and outdoor screenings.",
      specification: "4000 lumens, 1920x1080, HDMI/USB, 3LCD technology, 10,000hr lamp life",
      image: "",
      price: 1000,
      total_qty: 4,
      status: "Available",
      created_at: new Date(),
    },
  ]);

  const equipmentIds = Object.values(equipmentResult.insertedIds);
  console.log("✅ Equipment seeded");

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookingsResult = await db.collection("bookings").insertMany([
    {
      user_id: userIds[1],
      equip_id: equipmentIds[0], // DSLR Camera
      start_date: new Date("2025-12-10"),
      end_date: new Date("2025-12-12"),
      quantity: 2,
      rental_days: 2,
      total_amount: 3200,
      status: "Approved",
      payment_status: "Success",
      created_at: new Date("2025-12-08"),
    },
    {
      user_id: userIds[2],
      equip_id: equipmentIds[2], // PA Speaker
      start_date: new Date("2025-12-15"),
      end_date: new Date("2025-12-16"),
      quantity: 4,
      rental_days: 1,
      total_amount: 2400,
      status: "Approved",
      payment_status: "Success",
      created_at: new Date("2025-12-13"),
    },
    {
      user_id: userIds[1],
      equip_id: equipmentIds[7], // Projector
      start_date: new Date("2026-01-05"),
      end_date: new Date("2026-01-07"),
      quantity: 1,
      rental_days: 2,
      total_amount: 2000,
      status: "Pending",
      payment_status: "Pending",
      created_at: new Date(),
    },
  ]);

  const bookingIds = Object.values(bookingsResult.insertedIds);
  console.log("✅ Bookings seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("payments").insertMany([
    {
      booking_id: bookingIds[0],
      user_id: userIds[1],
      amount: 3200,
      payment_type: "Razorpay",
      razorpay_order_id: "order_demo_001",
      razorpay_payment_id: "pay_demo_001",
      razorpay_signature: "sig_demo_001",
      status: "Success",
      date: new Date("2025-12-08"),
    },
    {
      booking_id: bookingIds[1],
      user_id: userIds[2],
      amount: 2400,
      payment_type: "Razorpay",
      razorpay_order_id: "order_demo_002",
      razorpay_payment_id: "pay_demo_002",
      razorpay_signature: "sig_demo_002",
      status: "Success",
      date: new Date("2025-12-13"),
    },
  ]);

  console.log("✅ Payments seeded");

  // ── Feedbacks ─────────────────────────────────────────────────────────────
  await db.collection("feedbacks").insertMany([
    {
      user_id: userIds[1],
      booking_id: bookingIds[0],
      service_id: equipmentIds[0], // service_id = equip_id as per DD
      rating: 5.0,
      feedback: "The DSLR camera was in perfect condition. Excellent image quality. Will definitely rent again!",
      datetime: new Date("2025-12-13"),
    },
    {
      user_id: userIds[2],
      booking_id: bookingIds[1],
      service_id: equipmentIds[2],
      rating: 4.5,
      feedback: "Great PA speakers for our event. Loud, clear sound. Delivery and pickup was smooth.",
      datetime: new Date("2025-12-17"),
    },
  ]);

  console.log("✅ Feedbacks seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────");
  console.log("👤 Admin   → admin@equipment.com  / Admin@123");
  console.log("👤 User 1  → karan@gmail.com      / Karan@123");
  console.log("👤 User 2  → sneha@gmail.com      / Sneha@123");
  console.log("──────────────────────────────────────────");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
