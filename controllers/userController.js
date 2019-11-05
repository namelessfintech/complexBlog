// a controller to intermediate routes and controllers:
const User = require("../models/User");

exports.loggedIn = (req, res, next)=>{
  if(req.session.user){
    next()
  }else{
    req.flash("errors","You must be loggedin to create a post");
    req.session.save(function(){
      res.redirect("/")
    })
  }
}
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
        profilePic: user.profilePic,
        username: user.data.username,
        _id:user.data._id
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
  user.register().then(()=>{
    // log the user in
    req.session.user = {username: user.data.username, profilePic:user.profilePic, _id: user.data._id}
    req.session.save(() => {
      res.redirect("/");
    });
  }).catch((regErrors)=>{
     regErrors.forEach(err => {
       req.flash("regErrors", err);
     });
     req.session.save(() => {
       res.redirect("/");
     });
  })

  
};

exports.home = (req, res) => {
  if (req.session.user) {
    res.render("home-hub");
  } else {
    res.render("home-guest",{errors: req.flash('errors'), regErrors:req.flash('regErrors')});
  }
};
