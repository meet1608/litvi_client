const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

// ✅ Configure CORS to allow frontend requests
const corsOptions = {
  origin: "*", // Allows requests from any origin
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Litvi Backend is Running!");
});

app.use("/auth", authRoutes);
app.use("/auth", passwordResetRoutes);

app.use((err, req, res, next) => {
  if (err.name === "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
