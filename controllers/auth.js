"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require("express");
const router = express.Router();
const database  = require("../models");
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
      passport.authenticate("local", {
        successRedirect: "/",
        successFlash: "Account created user signed in."
      })
      res.redirect("/");
    } else {
      // if not created, the email already exists
      req.flash("error", "An account with this email address already exists.");
      res.redirect("/auth/sign-up");
    }
    
  } catch (error) {
    req.flash("error", error.message);;
    res.redirect("/auth/sign-up");
  };
});

router.get("/sign-in", (req, res) => {
    res.render("sign-in");
})

router.post("/sign-in", passport.authenticate("local", {
  successRedirect: `/user`,
  failureRedirect: "/auth/sign-in",
  failureFlash: "Incorrect username or password.",
  successFlash: "Welcome! You are now signed in."
}));

router.get("/sign-out", async (req, res) => {
  req.logout();
  req.flash("success", "You are now signed out.");
  res.redirect("/");
});

module.exports = router;