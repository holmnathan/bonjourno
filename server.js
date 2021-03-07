"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require("express"); // Express
const ejs = require("ejs"); // Embedded JavaScript Templates
const express_layouts = require("express-ejs-layouts"); // Express EJS Layouts
const app = express();
const appName = "bonjourno";
const db = require("./models");
const session = require("express-session");
const passport = require("./config/passport-config");
const flash = require("connect-flash");
const authorized = require('./middleware/authorized');
const methodOverride = require('method-override');

//-----------------------------------------------------------------------------
// Controllers
//-----------------------------------------------------------------------------

const auth_controller = require("./controllers/auth.js");
const user_controller = require("./controllers/user.js");

//-----------------------------------------------------------------------------
// Middleware
//-----------------------------------------------------------------------------

app.set("view engine", "ejs"); // Set layout engine for rendering files

app.use(express.static(__dirname + "/public")); // Serve static files
app.use(express.urlencoded({ extended: false }));
app.use(express_layouts);

// Generate session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.current_user = req.user;
  next();
});

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.render("index.ejs");
})

app.use("/auth", auth_controller);
app.use("/", user_controller);

//-----------------------------------------------------------------------------
// Listeners
//-----------------------------------------------------------------------------

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`${appName} running on port ${process.env.PORT || 8000}`);
});