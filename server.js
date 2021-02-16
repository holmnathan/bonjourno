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

//-----------------------------------------------------------------------------
// Middleware
//-----------------------------------------------------------------------------

app.set("view engine", "ejs"); // Set layout engine for rendering files

app.use(express.static(__dirname + "/public")); // Serve static files
app.use(express.urlencoded({ extended: false }));
app.use(express_layouts); //

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Listeners
//-----------------------------------------------------------------------------

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`${appName} running on port ${process.env.PORT || 8000}`);
});