const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const Redis = require('connect-redis')(session);

const User = require('./db/models/User');


const app = express();


app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(session({
  store: new Redis(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static('public'));

//passport stuff
app.use(passport.initialize());
app.use(passport.session());

//after login
passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

//after every request
passport.deserializeUser((user, done) => {
  console.log('deserializing');
  new User({
      id: user.id
    }).fetch()
    .then((user) => {
      user = user.toJSON();
      return done(null, {
        id: user.id,
        username: user.username
      });
    })
    .catch((err => {
      console.log(err);
      return done(err);
    }));
});

passport.use(new LocalStrategy(function (username, password, done) {
  return new User({
      username: username
    }).fetch()
    .then(user => {
      user = user.toJSON();
      console.log(user);

      if (user === null) {
        return done(null, false, {
          message: 'bad username or password'
        });
      } else {
        console.log(password, user.password);
        bcrypt.compare(password, user.password)
          .then(res => {
            if (res) {
              console.log(res);
              return done(null, user);
            } else {
              return done(null, false, {
                message: 'Bad usernmae or password'
              });
            }
          });
      }
    })
    .catch(err => {
      console.log('error', err);
      return done(err);
    })
}));


app.use('/', routes);

app.get('*', (req, res) => {
  res.status(404).redirect('/404.html');
});

module.exports = app;