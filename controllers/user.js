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
});

router.get("/:username", async ( req, res ) => {
  let page_title;
  let user;
  console.log(req.query.date_sort);
  try {
    const entries = await database.journal_entry.findAll(
      {
        where: {
          visible: true
        },
        order: [
          ["date_time", req.query.date_sort || "ASC"]
        ],
        include: [
          {
            model: database.user,
            where: {
              username: req.params.username
            }
          },
          {
            model: database.tag,
            through: database.journal_entries_tags,
            include: [
              {
                model: database.tag_color,
                as: "colors"
              }
              ]
          }
        ]
      }
    );
    user = entries[0].user;
    req.flash("success", `User Found: ${user.username}`);
    res.render("user/dashboard.ejs", {user, entries});
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("/");
  }
});

router.get("/:username/account", authorized, async ( req, res ) => {
  res.render("user/account");
});

module.exports = router;