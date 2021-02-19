"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require("express");
const router = express.Router();
const database  = require("../models");
// require the passport configuration at the top of the file
const passport = require("../config/passport-config");

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
      res.redirect("/auth/sign-up");
    }
    
  } catch (error) {
    console.log("An error occurred: ", error.message);
    res.redirect("/auth/sign-up");
  };
});

router.get("/log-in", async (req, res) => {
  res.render("log-in");
})

router.post("/log-in", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/log-in"
}));

module.exports = router;