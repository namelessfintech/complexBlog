const usersCollection = require("../db")
  .db()
  .collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// a model object for an individual user:
let User = function(data) {
  this.data = data;
  this.errors = [];
};

// a model method to sanitize a users input:
User.prototype.cleanInput = function() {
  // anything not a string is blocked in validator:
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // get rid of unpermitted input properties and purify data for validation and saving:
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  };
};

// a model method to validate a user input:
User.prototype.validate = function() {
  return new Promise(async (resolve, reject) => {
    // validate username:
    if (this.data.username == "") {
      this.errors.push("You must provide a user name");
    }
    if (
      this.data.username != "" &&
      !validator.isAlphanumeric(this.data.username)
    ) {
      this.errors.push("Username can only contain letters and numbers");
    }
    if (this.data.username.length > 0 && this.data.username.length < 3) {
      this.errors.push("Username must be at least 3 chars");
    }
    if (this.data.username.length > 15) {
      this.errors.push("Username cannot exceed 15 characthers");
    }

    //validate a users email:
    if (this.data.email == "") {
      this.errors.push("You must provide a valid email address");
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("You must provide a valid email address");
    }

    // validate passwords:
    if (this.data.password == "") {
      this.errors.push("You must provide a valid password");
    }
    if (this.data.password.length > 0 && this.data.password.length < 5) {
      this.errors.push("Password must be at least 5 chars");
    }
    if (this.data.password.length > 50) {
      this.errors.push("Password cannot exceed 50 characthers");
    }

    // only if username is valid check to see if it is unique:
    if (
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username)
    ) {
      let usernameExists = await usersCollection.findOne({
        username: this.data.username
      });
      if (usernameExists) {
        this.errors.push("That username is already taken");
      }
    }

    // only if username is valid check to see if it is unique:
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({
        email: this.data.email
      });
      if (emailExists) {
        this.errors.push("That email is already taken");
      }
    }
    resolve();
  });
};

// a simple promise approach to login a user:
// User.prototype.login = function() {
//     return new Promise((resolve, reject)=>{
//       // 1. clean data inputs
//       this.cleanInput();
//       // call db for given user inputs
//       usersCollection.findOne({username:this.data.username},(err,unauthedUser)=>{
//         if(unauthedUser && unauthedUser.password == this.data.password){
//           resolve('User Found')
//         }else{
//           reject('Invalid username or password')
//         }
//       })
//     })
// };

// a mongoDB promise approach to login a user:
User.prototype.login = function() {
  return new Promise((resolve, reject) => {
    // 1. clean data inputs
    this.cleanInput();
    // 2. call db for a given input using mongos returned promise
    usersCollection
      .findOne({ username: this.data.username })
      .then(unauthedUser => {
        if (
          unauthedUser &&
          bcrypt.compareSync(this.data.password, unauthedUser.password)
        ) {
          resolve("User Found");
        } else {
          reject("Invalid username / password");
        }
      })
      .catch(err => reject("Please try again"));
  });
};

// a model method to register a new user:
User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    // 1. clean data inputs
    this.cleanInput();
    // 2. validate user data:
    await this.validate();
    // 3. if no validation error save user:
    if (!this.errors.length) {
      // 4. salt and hash the user password
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await usersCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

module.exports = User;
