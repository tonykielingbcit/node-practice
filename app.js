"use strict";

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();

// Database Setup
require("./db/connection.js");

// Set up our server
const app = express();
// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up session management
app.use(
  require("express-session")({
    // secret: "a long time ago in a galaxy far far away",
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up EJS templating
app.set("view engine", "ejs");
// Enable layouts
app.use(expressLayouts);
// Set the default layout
app.set("layout", "./layouts/main-layout.ejs");
// Make views folder globally accessible
app.set("views", path.join(__dirname, "views"));
// Make the public folder accessible for serving static files
app.use(express.static("public"));


/********** APP ROUTES **********/
// Index routes
const indexRoute = require("./routes/indexRouter.js");
app.use(indexRoute);

// User routes
const userRouter = require("./routes/userRouter.js");
// app.use("/user", userRouter);
app.use(
  "/user", 
  ((req, res, next) => {
      console.log("req.body-APP:::::::::: ", req.body);
      console.log("req.body-APP-isAuthenticated:::::::::: ", req.isAuthenticated());
      next();
  }), 
  userRouter
);

// Secure routes
const secureRouter = require("./routes/secureRouter.js");
app.use("/secure", secureRouter);

// Error Route
const error = require("./controllers/errorController");
app.use("*", error.Index);
// res.redirect("/user/login?errorMessage=You must be logged in to view this page.");

/********************************/


// Start listening
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Auth Demo App is running on http://localhost:${port}!`));
