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
        successFlash: `<h2>Welcome</h2><p>Your account was successfully created.</br>You are now signed in.<p>`
      })
      res.redirect("/");
    } else {
      // if not created, the email already exists
      req.flash("error", `<h2>Account already Exists</h2><p>A user with this username or email address is already active on bonjourno.<p>`);
      res.redirect("/auth/sign-up");
    }
    
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);;
    res.redirect("/auth/sign-up");
  };
});

router.get("/sign-in", (req, res) => {
    res.render("sign-in");
})

router.post("/sign-in", passport.authenticate("local", {
  successRedirect: `/user`,
  failureRedirect: "/auth/sign-in",
  failureFlash: `<h2>Incorrect Credentials</h2><p>You entered an incorrect username or password.<p>`,
  successFlash: `<h2>Welcome</h2><p>You are now signed in.<p>`
}));

router.get("/sign-out", async (req, res) => {
  req.logout();
  req.flash("success", `<h2>See You Soon</h2><p>You are now signed out.<p>`);
  res.redirect("/");
});

module.exports = router;