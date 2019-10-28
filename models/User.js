
let User = function(data) {
  this.data = data
  this.errors = []
}

User.prototype.validate = function(){
  console.log(this.data.username)
  if (this.data.username == "") {
    this.errors.push("You must provide a user name");
  }
  if(this.data.email ==""){this.errors.push("You must provide a valid email address");}
  if(this.data.password ==""){this.errors.push("You must provide a valid password");}
}

User.prototype.register = function(){
    // validate user data:
    this.validate();
    // if no validation error save user:
}

module.exports = User