const usersCollection = require("../db").collection("users");
const validator = require('validator')


// a model for an individual user
let User = function(data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanInput = function(){
  // anything not a string is blocked in validator:
  if(typeof(this.data.username) != 'string' ){this.data.username == ""};
  if(typeof(this.data.email) != 'string' ){this.data.username == ""};
  if(typeof(this.data.password) != 'string' ){this.data.username == ""};

  // get rid of unpermitted input properties and purify data for validation and saving:
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  };
}

User.prototype.validate = function(){

  // validate username:
  if(this.data.username == "") {this.errors.push("You must provide a user name");}
  if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push("Username can only contain letters and numbers")};
  if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 chars");}
  if (this.data.username.length > 15) {this.errors.push("Username cannot exceed 15 characthers");}

  //validate a users email:
  if(this.data.email ==""){this.errors.push("You must provide a valid email address");}
  if(!validator.isEmail(this.data.email)){this.errors.push("You must provide a valid email address");}

  // validate passwords
  if(this.data.password ==""){this.errors.push("You must provide a valid password");}
  if(this.data.password.length > 0 && this.data.password.length <5){ this.errors.push("Password must be at least 5 chars");}
  if(this.data.password.length >100){this.errors.push("Password cannot exceed 100 characthers")}

}

// a method to register a new user
User.prototype.register = function(){
    // 1. clean data inputs
    this.cleanInput();
    // 2. validate user data:
    this.validate();
    // 3. if no validation error save user:
    if(!this.errors.length){
      usersCollection.insertOne(this.data);
    }
}

module.exports = User