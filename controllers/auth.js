"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require('express');
const router = express.Router();

const database  = require('../models');

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

router.get("/sign-up", (req, res) => {
  res.render("sign-up.ejs");
})

router.post("/sign-up", async (req, res) => {
  try {
    const [user, created] = await database.user.findOrCreate({
      where: { email: req.body.email, username: req.body.username },
      defaults: {
        full_name: req.body.full_name,
        display_name: req.body.display_name,
        password: req.body.password,
        birth_date: req.body.birth_date ? req.body.birth_date : null
      }
    });
    
    if (created) {
      // if created, success and redirect home
      console.log(`────────────────────────────────────────`);
      console.log(` User Created:`);
      console.log(`────────────────────────────────────────`);
      console.log(` Full Name: ${user.full_name}`);
      console.log(` Username: ${user.username}`);
      console.log(` Email: ${user.email}`);
      console.log(`────────────────────────────────────────`);
      
      res.redirect("/");
    } else {
      // if not created, the email already exists
      console.log("Email already in use");
      res.redirect("/sign-up");
    }
    
  } catch (error) {
    console.log("An error occurred: ", error.message);
    res.redirect("/sign-up");
  };
});

module.exports = router;
