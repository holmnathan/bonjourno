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
const cloudinary = require("cloudinary");
const {data_uri, multer_upload} = require("../middleware/data_uri")

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
          },
          {
            model: database.image,
            include: database.image_source
          }
        ]
      }
    );
    page_title = user.full_name
    // req.flash("success", `<h2>Journal Found<h2><p>Now viewing ${user.full_name}’s Public Journal.</p>`);
    res.render("user/dashboard/index.ejs", {user, entries, page_title});
    
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>` || error);
    res.redirect("/");
  }
});

router.delete("/:username/:journal_id", async ( req, res ) => {
  try {
    database.journal_entry.destroy({
      where: {
        id: req.params.journal_id
      }
    });
    req.flash(`<h2>Entry Deleted</h2><p>Article ${req.params.journal_id} has been deleted.</p>`);
    } catch (error) {
      req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
  res.redirect(`/${req.params.username}`)
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
    
    const colors = await database.tag_color.findAll({
      order: [
        ["id", "asc"], [{ model: database.tag }, "name", "asc"]
      ],
      include: [
        {
          model: database.tag,
          include: {
            model: database.user,
            where: {
              username: req.params.username
            }
          }
        },
      ]
    });
    
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
    res.render("user/tag-library/index", { page_title, tags, user, colors});
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
});

router.post("/:username/tags/new", async ( req, res ) => {
  try {
    const current_user = res.locals.current_user;
    const tag = await database.tag.create({
          name: req.body.tag_name,
          color_id: req.body.tag_color,
          user_id: current_user.id
        }
    );
    req.flash(`<h2>Tag Created</h2><p>${req.body.tag_name} has been added to your Tag Library.</p>`)
    res.redirect(`/${current_user.username}/tags`);
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
    res.redirect(`/${current_user.username}/tags`);
  }
});

router.delete("/:username/tags/:id", async ( req, res ) => {
    const current_user = res.locals.current_user;
  try {
    database.tag.destroy({
      where: {
        id: req.params.id
      }
    });
    req.flash(`<h2>Tag Deleted</h2><p>Tag ${req.params.id} has been deleted.</p>`);
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
  res.render(`/${current_user.username}/tags`);
});

router.put("/:username/tags/:id", async ( req, res ) => {
    const current_user = res.locals.current_user;
  try {
    database.tag.update({
      name: req.body.tag_name
    }, {
      where: {
        id: req.params.id
      }
    });
    req.flash(`<h2>Tag Updated</h2><p>Tag name has been updated to ${req.body.tag_name}.</p>`)
  } catch (error) {
    req.flash("error", `<h2>Unexpected Error</h2><p>${error.message}<p>`);
  }
  res.redirect(`/${current_user.username}/tags`);
});

// router.get("/:username/journal-:entry", async (req, res) => {
//   
// })

router.get("/:username/compose", async ( req, res ) => {
  res.render("journal/editor", { GOOGLE_API_KEY: process.env.GOOGLE_API_KEY, edit_mode: "compose"})
});

router.post("/:username/compose", async ( req, res ) => {
  try {
    console.log("COMPOSE COMPOSE COMPOSE")
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
  } catch (error) {
    console.log(error);
  }
  res.redirect()
});

router.get("/:username/:journal_id/editor", async ( req, res ) => {
  try {
    const entry = await database.journal_entry.findByPk(req.params.journal_id, {
      include: [
        database.user,
        {
          model: database.image,
          include: database.image_source
        }
      ]
    });
    res.render("journal/editor", {entry, user: entry.user, image: entry.image, GOOGLE_API_KEY: process.env.GOOGLE_API_KEY, edit_mode: "edit"})
    
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:username/:journal_id", async ( req, res ) => {
  try {
    const entry = await database.journal_entry.findByPk(req.params.journal_id, {
      include: [
        database.user,
        {
          model: database.image,
          include: database.image_source
        }
      ]
    });

    res.render("journal/index", {entry, user: entry.user, image: entry.image})
    
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:username/:journal_id/image", async ( req, res ) => {
  try {
    const properties = {};
    
    const entry = await database.journal_entry.findByPk(req.params.journal_id, {include: [database.user, {model: database.image, include: database.image_source}]});
    
    properties.entry = entry.dataValues
    properties.user = entry.user ? entry.user.dataValues : undefined;
    properties.image = entry.image !== null ? entry.image.dataValues : undefined;
    properties.image_source = entry.image ? entry.image.image_source.dataValues : undefined;
    
    res.render("image/index", {...properties})
    
    res.redirect("image");
    
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/:username/:journal_id/image",multer_upload, async ( req, res ) => {
  try {
    const file = await data_uri(req).content;
    
    const cloudinary_upload = await cloudinary.uploader.upload(file)
    console.log(cloudinary_upload)
    
    const image = await database.image.findOrCreate({
      where: {
        asset_id: cloudinary_upload.public_id,
        source_id: 2
      }
    });
    
    const entry = await database.journal_entry.findByPk(req.params.journal_id)
    
    
    entry.setImage(image[0].id);
    
    console.log(entry)
    
  } catch (error) {
    console.log(error.message);
  }
    res.redirect("image")
});

router.delete("/:username/:journal_id/image", async ( req, res ) => {
  try {
    const entry = await database.journal_entry.findByPk(req.params.journal_id, {
      include: {
        model: database.image
      }
    });
    
    console.log(entry)
    
    const remove = await entry.image.destroy({
      where: {id: entry.image_id}
    });
    
    entry.update({
      image_id: null
    });
  } catch (error) {
    console.log(error);
  }
    res.redirect("image");
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