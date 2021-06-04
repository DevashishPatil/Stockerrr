var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');


var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req ,res) => {
    try {
        res.send("Hello")

    } catch (error) {
        console.error(error)
    }
});

app.listen(process.env.PORT || 8080, () => {
    console.log("App running")
});