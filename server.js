const MiniSearch = require('minisearch')
const fs = require('fs')

var json = "";
try {
    var data = fs.readFileSync('./index_3.json', 'utf8');
    json = data;
  } catch(e) {
      console.log('Error:', e.stack);
  }

let miniSearch = new MiniSearch({
  fields: ['text'], // fields to index for full-text search
  storeFields: ['id', 'text', 'link'] // fields to return with search results
})

miniSearch = MiniSearch.loadJSON(json, { fields: ['id', 'text', 'category'] })


var express = require('express')
var app = express()

const http = require("http");

const host = 'localhost';
const port = 8000;
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

app.get("/about", function(req, res){
    res.sendFile(__dirname +"/public/about.html");
});
app.get('/search/:srch', function(req, res, next){
  var results = miniSearch.search(req.params.srch);
  res.json(results);
});


app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.sendFile(__dirname +"/404.html");
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
