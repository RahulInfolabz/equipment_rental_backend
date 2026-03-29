const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Multer Instances ──────────────────────────────────────────────────────────
const { categoryUpload, equipmentUpload, profileUpload } = require("./multer/multer");

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetCategories } = require("./apis/user/GetCategories");
const { GetEquipment } = require("./apis/user/GetEquipment");
const { GetEquipmentDetails } = require("./apis/user/GetEquipmentDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { PlaceBooking } = require("./apis/user/PlaceBooking");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ── Admin APIs ────────────────────────────────────────────────────────────────
const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddCategory } = require("./apis/admin/AddCategory");
const { UpdateCategory } = require("./apis/admin/UpdateCategory");
const { DeleteCategory } = require("./apis/admin/DeleteCategory");
const { GetAdminCategories } = require("./apis/admin/GetCategories");
const { AddEquipment } = require("./apis/admin/AddEquipment");
const { UpdateEquipment } = require("./apis/admin/UpdateEquipment");
const { DeleteEquipment } = require("./apis/admin/DeleteEquipment");
const { GetAdminEquipment } = require("./apis/admin/GetEquipment");
const { GetBookings } = require("./apis/admin/GetBookings");
const { UpdateBooking } = require("./apis/admin/UpdateBooking");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { DashboardStats } = require("./apis/admin/DashboardStats");

// ─────────────────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "equipment_rental_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ── Static File Serving ───────────────────────────────────────────────────────
app.use("/uploads/categories", express.static("uploads/categories"));
app.use("/uploads/equipment", express.static("uploads/equipment"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs
// ─────────────────────────────────────────────────────────────────────────────
app.get("/categories", GetCategories);
// filters: ?category_id= ?min_price= ?max_price=
app.get("/equipment", GetEquipment);
app.get("/equipment/:id", GetEquipmentDetails);
app.get("/feedbacks", GetFeedbacks);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs
// ─────────────────────────────────────────────────────────────────────────────
app.get("/user/profile", GetProfile);
app.post("/user/updateProfile", profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/placeBooking", PlaceBooking);
app.get("/user/myBookings", MyBookings);
app.post("/user/cancelBooking", CancelBooking);
app.post("/user/genOrderId", GenOrderId);
app.post("/user/verifyPayment", VerifyPayment);
app.post("/user/addFeedback", AddFeedback);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN APIs
// ─────────────────────────────────────────────────────────────────────────────

// Users
app.get("/admin/users", GetUsers);
app.post("/admin/updateUserStatus", UpdateUserStatus);

// Categories
app.post("/admin/addCategory", categoryUpload.single("image"), AddCategory);
app.post("/admin/updateCategory", categoryUpload.single("image"), UpdateCategory);
app.get("/admin/deleteCategory/:id", DeleteCategory);
app.get("/admin/categories", GetAdminCategories);

// Equipment
app.post("/admin/addEquipment", equipmentUpload.single("image"), AddEquipment);
app.post("/admin/updateEquipment", equipmentUpload.single("image"), UpdateEquipment);
app.get("/admin/deleteEquipment/:id", DeleteEquipment);
app.get("/admin/equipment", GetAdminEquipment);

// Bookings
app.get("/admin/bookings", GetBookings);
app.post("/admin/updateBooking", UpdateBooking);

// Reports
app.get("/admin/payments", GetPayments);
app.get("/admin/feedbacks", GetAdminFeedbacks);
app.get("/admin/dashboardStats", DashboardStats);

app.get("/", (req, res) => {
  res.send("Welcome to Equipment Rental Service Platform API!");
});


// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Equipment Rental server started on PORT ${PORT}!`)
);
