const http = require('http');
const zlib = require('zlib');
const xtreamer = require('xtreamer');
const parseString = require('xml2js').parseString;
/**
 * Parse a xml datex2 feed into a json-ld feed
 * @param  {string} source  a valid URL that goes to an xml datex2 feed
 * @return {Promise}        will return the json once parsing has completed
 */
function parse(url, template) {
  console.log('START FETCHING')
  return new Promise((resolve, reject) => {
    let gunzip = zlib.createGunzip();
    const options = {
      max_xml_size: 1000000000
    };
    let xtreamerTransform = xtreamer('situation', options);
    http.get(url, res => {
      res.pipe(gunzip).pipe(xtreamerTransform);
      let situations = [];
      xtreamerTransform.on('data', data => {
        //XML2JS
        let xmlSituation = data.toString();
        parseString(xmlSituation, (err, result) => {
          situations.push(result);
        })
      });
      xtreamerTransform.on('end', () => {
        console.log('END');
        resolve(situations);
      })
    }).on('error', error => console.error(error));


  })
}

module.exports = parse;
