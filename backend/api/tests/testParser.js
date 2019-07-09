const parse = require('../parserToJson')
const fs = require('fs')

parse('http://opendata.ndw.nu/brugopeningen.xml.gz')
    .then(result => fs.writeFileSync('bridges.json', JSON.stringify(result)))