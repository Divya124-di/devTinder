const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());



// app.use(
//   cors({
//     origin: "http://localhost:5173", // frontend origin
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // allow PATCH
//     credentials: true,
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );

// CORS middleware

const corsOptions = {
  origin: "http://localhost:5173", // Your frontend origin
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // include PATCH!
  credentials: true,
};

app.use(cors(corsOptions));

// 👇 This line is critical for OPTIONS preflight requests
app.options("*", cors(corsOptions));


// Connect to Database First
connectDB()
  .then(() => {
    console.log("✅ Database connection established...");

    // Import Routes
    const authRouter = require("./routes/auth");
    const profileRouter = require("./routes/profile");
    const requestRouter = require("./routes/request");
    const userRouter = require("./routes/user");

    // Use Routes
    app.use("/", authRouter);
    app.use("/", profileRouter);
    app.use("/", requestRouter);
    app.use("/", userRouter); 

    // Start Server
    const PORT = process.env.PORT || 7777;
    app.listen(PORT, () => {
      console.log(`🚀 Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
