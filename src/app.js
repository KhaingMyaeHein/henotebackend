const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();


// security
app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    success : true,
    message : "Server is running"});
});

// Routes
// http://localhost:4848/api/auth/register
// http://localhost:4848/api/auth/login
app.use("/api/auth", require("./routes/authRoute"));
//http://localhost:4848/api/note/function
app.use("/api/note",require("./routes/noteRoute"));
//http://localhost:4848/api/admin/stats
app.use("/api/admin",require("./routes/appRoutes"));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
  console.error(err);
});
module.exports = app;
