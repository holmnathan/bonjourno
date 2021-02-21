"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require("express");
const router = express.Router();
const database  = require("../models");
const authorized = require("../middleware/authorized");

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

router.get("/")

module.exports = router;