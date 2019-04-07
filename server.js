var http = require("http"),
  express = require("express"),
  path = require("path");

var app = express();

app.use(express.static(__dirname));
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

var server = http.createServer(app);

server.listen(1500);

// SCRAPER CODE

const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/18';

var foods = [];

puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    $( 'li.ng-scope > a', html ).each(function() {
      let curFood = $( this ).text();
      let costIndex = curFood.indexOf( '$' )
      let foodCost = curFood.slice( costIndex )
      let foodName = curFood.slice( 0, costIndex )
      let finalFood = { name: foodName.trim(), cost: foodCost }
      foods.push( finalFood )
    });
  })
  .then( function() {
    for( let i = 0; i < foods.length; i++ ) {
      console.log( 'name: ' + foods[ i ].name + ' | cost: ' + foods[ i ].cost )
    }
  })
  .then( function() {
    //process.exit()
  })
  .catch(function(err) {
    //handle error
  });
