var express = require('express');
var request = require('request');
var cheerio = require('cheerio');


var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req ,res) => {
    try {

        request('https://www.moneycontrol.com/stocks/marketinfo/bonus/index.php?sel_year=2021', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html)

                    var keys = [
                        'Company',
                        'Bonus_Ratio',
                        'Announcement_Date',
                        'Record_Date',
                        'ExBonus_Date'
                    ]
                    
                    var tableArr = []
                    
                    $(".dvdtbl tbody tr").each((i, el) => {
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
                }
            });

    } catch (error) {
        console.error(error)
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("App running")
});