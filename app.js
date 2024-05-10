require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = process.env.DB_URL;
mongoose
  .connect(dbURI)
  .then((result) => app.listen(8000))
  .catch((err) => console.log(err));

// routes'
app.get('*', checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth,  (req, res) => res.render("smoothies"));
app.use(authRoutes);

// set cookies example
app.get("/set-cookies", (req, res) => {
  res.cookie("newUser", false); // set cookie
  res.cookie("isEmployee", false, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  }); // set cookie with options

  res.send("Cookies set");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});
