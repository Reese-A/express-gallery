const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

const app = express();

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routes);

module.exports = app;