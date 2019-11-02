const express = require('express');
const app = express();
const router = require('./router');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let sessionOptions = session({
  secret:"code like humanity depends on it",
  store: new MongoStore({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  // sets a cookie with an age of 1 day
  cookie: {maxAge:1000*60*60*24, httpOnly:true}
})

app.use(sessionOptions);

app.use(express.urlencoded({extended:false}));
app.use(express.json())

app.use(express.static('public'));

app.set('views','views');
app.set('view engine','ejs');

app.use('/', router);

module.exports = app