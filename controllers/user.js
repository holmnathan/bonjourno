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
  try {
    const user = await database.user.findOne({
      where: {
        username: req.params.username
        },
      attributes: {
        exclude: [
          "password",
          "birth_date",
          "email"
        ]
      },
      include: [
        {
          model: database.journal_entry,
          as: "entries",
          where: {
            visible: true
          },
          required: false,
          attributes: [
            "title",
            "body",
            "date_time"
          ],
          include: [
            {
              model: database.tag,
              through: {
                where: database.journal_entries_tags
              },
              include: [
                {
                  model: database.tag_color,
                  as: "colors"
                }
              ]
            }
          ]
        }
      ]
    });
    // console.log(user.entries);
    page_title = user.full_name;
    req.flash("success", `User Found: ${user.username}`);
    res.render("user/dashboard.ejs", {page_title, user, entries: user.entries, tags: user.entries.tag});
  } catch (error) {
    req.flash("error", error.message)
    res.redirect("/");
  }
});

router.get("/:username/account", authorized, async ( req, res ) => {
  res.render("user/account");
});

module.exports = router;