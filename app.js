const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
let port = process.env.PORT || 3000;


const app = express();

var result = {};

app.get('/bonus/:year', async (req ,res) => {
    try {
        var bonusYear = req.params.year
        const siteURL = "https://www.moneycontrol.com/stocks/marketinfo/bonus/index.php?sel_year="+bonusYear

        const { data } = await axios({
            method: "GET",
            url: siteURL,
        })
        
        const $ = cheerio.load(data)
        const elmSelector = "#mc_mainWrapper > div.PA10 > div.FL > div:nth-child(12) > div.FL.PR20 > div.MT15 > table > tbody > tr"

        const keys = [
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

        res.send(JSON.stringify(tableArr))

    } catch (error) {
        console.error(error)
    }
});

app.listen(port);