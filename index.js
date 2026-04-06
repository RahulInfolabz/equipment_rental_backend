const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnect");
const authMiddleware = require("./middleware/auth");
require("dotenv").config();

const { categoryUpload, equipmentUpload, profileUpload } = require("./multer/multer");

const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

const { GetCategories } = require("./apis/user/GetCategories");
const { GetEquipment } = require("./apis/user/GetEquipment");
const { GetEquipmentDetails } = require("./apis/user/GetEquipmentDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { PlaceBooking } = require("./apis/user/PlaceBooking");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

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

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:3000", "http://localhost:3001",
    "http://localhost:5173", "http://localhost:5174",
    "https://your-frontend.onrender.com", // ← replace with your actual frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use("/uploads/categories", express.static("uploads/categories"));
app.use("/uploads/equipment", express.static("uploads/equipment"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

connectDB();

// COMMON APIs
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// PUBLIC APIs
app.get("/categories", GetCategories);
app.get("/equipment", GetEquipment);
app.get("/equipment/:id", GetEquipmentDetails);
app.get("/feedbacks", GetFeedbacks);

// USER APIs (JWT required)
app.get("/user/profile", authMiddleware, GetProfile);
app.post("/user/updateProfile", authMiddleware, profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/placeBooking", authMiddleware, PlaceBooking);
app.get("/user/myBookings", authMiddleware, MyBookings);
app.post("/user/cancelBooking", authMiddleware, CancelBooking);
app.post("/user/genOrderId", authMiddleware, GenOrderId);
app.post("/user/verifyPayment", authMiddleware, VerifyPayment);
app.post("/user/addFeedback", authMiddleware, AddFeedback);

// ADMIN APIs (JWT required)
app.get("/admin/users", authMiddleware, GetUsers);
app.post("/admin/updateUserStatus", authMiddleware, UpdateUserStatus);
app.post("/admin/addCategory", authMiddleware, categoryUpload.single("image"), AddCategory);
app.post("/admin/updateCategory", authMiddleware, categoryUpload.single("image"), UpdateCategory);
app.get("/admin/deleteCategory/:id", authMiddleware, DeleteCategory);
app.get("/admin/categories", authMiddleware, GetAdminCategories);
app.post("/admin/addEquipment", authMiddleware, equipmentUpload.single("image"), AddEquipment);
app.post("/admin/updateEquipment", authMiddleware, equipmentUpload.single("image"), UpdateEquipment);
app.get("/admin/deleteEquipment/:id", authMiddleware, DeleteEquipment);
app.get("/admin/equipment", authMiddleware, GetAdminEquipment);
app.get("/admin/bookings", authMiddleware, GetBookings);
app.post("/admin/updateBooking", authMiddleware, UpdateBooking);
app.get("/admin/payments", authMiddleware, GetPayments);
app.get("/admin/feedbacks", authMiddleware, GetAdminFeedbacks);
app.get("/admin/dashboardStats", authMiddleware, DashboardStats);

app.get("/", (req, res) => { res.send("Welcome to Equipment Rental Service Platform API!"); });

app.listen(PORT, () => console.log(`✅ Equipment Rental server started on PORT ${PORT}!`));
