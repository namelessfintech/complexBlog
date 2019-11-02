// a controller to intermediate routes and controllers:
const User = require("../models/User");

exports.login = (req, res) => {
  // 1. instantiate a new user with passed data
  let user = new User(req.body);
  // 2. call db function to sanitize and check for existing user
  user
    .login()
    .then(result => {
      // create a unique user session at login
      req.session.user = {
        anyStoredValue: "I can store any value",
        username: user.data.username
      };
      // save session to close db and redirect
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(err => {
      // 3. if err add a flash object onto req object and redirect with flash
      req.flash('errors',err)
      // make sure session saves before redirect
      req.session.save(()=>{
        res.redirect("/");
      })
      
    });
};

exports.logout = (req, res) => {
  // 1. destroy the session
  // 2. pass cb to redircect once session destroyed
  req.session.destroy(function() {
    res.redirect("/");
  });
};

exports.register = (req, res) => {
  // instantiate a new user
  let user = new User(req.body);
  // call register function
  user.register();
  // error handiling
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Registered with no errors");
  }
};

exports.home = (req, res) => {
  if (req.session.user) {
    res.render("home-hub", { username: req.session.user.username });
  } else {
    res.render("home-guest",{errors: req.flash('errors')});
  }
};
