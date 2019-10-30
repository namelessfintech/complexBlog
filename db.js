const mongodb = require('mongodb');
require("envkey");

mongodb.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    try {
       module.exports = client.db();
       const app = require("./app");
       app.listen(process.env.PORT);
       console.log("Server is running at localhost")
      
    } catch (error) {
      console.error(error.message)
    }
   
  }
);