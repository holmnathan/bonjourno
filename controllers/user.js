"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require("express");
const router = express.Router();
const database  = require("../models");
const authorized = require('../middleware/authorized');

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

router.get("/user", ( req, res, next ) => {
  next();
})

router.get("/:username", async ( req, res ) => {
  res.render("user-profile");
})

router.get("/:username/account", authorized, async ( req, res ) => {
  res.render("user/account");
})

module.exports = router;