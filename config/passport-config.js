"use strict"
const passport = require("passport");
const local_strategy = require("passport-local").Strategy;
const database = require("../models");

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser( async (id, cb) => {
  try {
  const user = await database.user.findByPk(id)
    cb(null, user);
  } catch (cb) {
    console.log(cb);
  }
});

passport.use(new local_strategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, cb) => {
  try {
    const user = await database.user.findOne({ 
      where: { email }
    })
    
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  } catch (cb) {
    console.log(cb);
  };
}));

module.exports = passport;