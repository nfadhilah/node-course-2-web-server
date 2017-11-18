const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const maitenanceMode = true;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.path} \n`

  fs.appendFile('server.log', log, (error) => {
    if (error) {
      console.log('Unable to append server.log');
    }
  });

  console.log(log);

  next();
});

if (maitenanceMode) {
  app.use((req, res, next) => {
    res.render('maintenance.hbs', {
      pageTitle: 'Will be right back',
      message: 'The site is currently being updated.'
    });
  });
}

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request.'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});