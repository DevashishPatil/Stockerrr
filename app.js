var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');
let port = process.env.PORT || 80;


var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', async(req ,res) => {
    try {
        var siteURL = "https://www.moneycontrol.com/stocks/marketinfo/bonus/index.php?sel_year=2021"

        var { data } = await axios({
            method: "GET",
            url: siteURL,
        })
        
        var $ = cheerio.load(data)
        var elmSelector = "#mc_mainWrapper > div.PA10 > div.FL > div:nth-child(12) > div.FL.PR20 > div.MT15 > table > tbody > tr"

        var keys = [
            'Company',
            'Bonus_Ratio',
            'Announcement_Date',
            'Record_Date',
            'ExBonus_Date'
        ]
        
        var tableArr = []
        
        $(elmSelector).each((i, el) => {
            var tableData = {}
            var link_placements = $(el).find('a').attr('href');
            if (i>1){
                $(el).children().each((ci, cel) => {
                    var tdValues = $(cel).text()
                    if (tdValues){
                        tableData[keys[ci]] = tdValues
                        tableData["Link"] = "https://www.moneycontrol.com" + link_placements
                    }
                })
                tableArr.push(tableData)
            }
        })

        res.send(tableArr)

    } catch (error) {
        console.error(error)
    }
});

app.listen(port, () => {
    console.log("App running")
});