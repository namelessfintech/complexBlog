// a controller to intermediate routes and controllers:
const User = require("../models/User");

exports.login = (req, res) => {
    console.log("the request orginally", req.body);
  // instantiate a new user with passed data
  let user = new User(req.body);
  // call a function to sanitize and check for existing user
  user.login();
};

exports.logout = () => {};

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
  res.render("home-guest");
};
