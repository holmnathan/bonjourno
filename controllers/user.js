"use strict";

//-----------------------------------------------------------------------------
// Global Variables and Node.js Dependencies
//-----------------------------------------------------------------------------

require("dotenv").config(); // Load “.env” Environment Variables

const express = require("express");
const router = express.Router();
const database  = require("../models");
const authorized = require("../middleware/authorized");
const axios = require("axios");

//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------

router.get("/user", ( req, res, next ) => {
  console.log("-------------------------")
  console.log(req.user.username)
  console.log("-------------------------")
  res.redirect(`/${req.user.username}`)
});

router.get("/:username", async ( req, res ) => {
  let page_title;
  try {
    const user = await database.user.findOne(
      {
        where: {
          username: req.params.username
        }
      }
    );
    if (user === null) throw new Error(`User “${req.params.username}” Not Found`);
  
    const entries = await database.journal_entry.findAll(
      {
        where: {
          visible: true
        },
        order: [
          ["date_time", req.query.date_sort || "asc"]
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
                as: "color"
              }
            ]
          }
        ]
      }
    );

    req.flash("success", `<h2>Journal Found<h2><p>Now viewing ${user.full_name}’s Public Journal.</p>`);
    res.render("user/dashboard.ejs", {user, entries});
    
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>` || error);
    res.redirect("/");
  }
});

router.get("/:username/account", authorized, async ( req, res ) => {
  res.render("user/account");
});

router.get("/:username/tags", async ( req, res ) => {
  
  try {
    const page_title = "Tag Library";
    const user = await database.user.findOne(
      {
        where: {
          username: req.params.username
        }
      }
    );
    
    const colors = await database.tag_color.findAll();
    
    const tags = await database.tag.findAll(
      {
        order: [
          ["color_id", "asc"]
        ],
        include: [
          {
            model: database.user,
            where: {
              username: req.params.username
            }
          },
          {
            model: database.tag_color,
            as: "color"
          },
          {
            model: database.journal_entry,
            through: database.journal_entries_tags,
            as: "entries"
          }
        ]
      }
    );
    res.render("user/tag-library", { page_title, tags, user, colors});
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
});

router.post("/:username/tags/new", async ( req, res ) => {
  console.log(req.body.tag_name)
  try {
    const tag = await database.tag.create(
      {
        where: {
          name: req.body.tag_name
        }
      }
    );
    res.redirect(`/${req.params.username}/tags`);
    req.flash("success", "IT POSTED! --------")
  } catch (error) {
    res.redirect(`/${req.params.username}/tags`);
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
});

// router.get("/:username/journal-:entry", async (req, res) => {
//   
// })

router.get("/journal-entry/new", async ( req, res ) => {
  res.render("journal/entry", { GOOGLE_API_KEY: process.env.GOOGLE_API_KEY });
});

router.post("/journal-entry/new", async ( req, res ) => {
  try {
    
    const current_user = res.locals.current_user;
    
    const entry = await database.journal_entry.findOrCreate(
      
      {
        where: {
          title: req.body.title,
          body: req.body.body,
          location_name: req.body.location_name,
          location_place_id: req.body.location_place_id,
          user_id: current_user.id,
          location_longitude: req.body.location_longitude,
          location_latitude: req.body.location_latitude,
          weather_icon: req.body.weather_icon,
          weather_condition: req.body.weather_condition,
          weather_temp_f: req.body.weather_temp_f
        },
        include: [database.user]
      }
    );
    console.log(entry.longitude, entry.latitude);
    res.redirect(`/${current_user.username}`)
    req.flash("success", `<h2>Journal Entry Saved</h2><p>Your new entry has been saved to your journal.<p>`);
  } catch (error) {
    res.redirect("/journal-entry/new");
    console.log(error);
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
})

module.exports = router;