const http = require('http');
const zlib = require('zlib');
const xtreamer = require('xtreamer');
const parseString = require('xml2js').parseString;

/**
 * Parse a xml datex2 feed into a json-ld feed
 * @param  {string} source a valid URL that goes to an xml datex2 feed
 * @return {Promise} will return an object which contains the situation
 */
function parse(url, node, next) {
  return new Promise((resolve, reject) => {
    let gunzip = zlib.createGunzip();
    // Option to allow xtreamer to parse a file bigger than 10MB (here 1 GB)
    const options = {
      max_xml_size: 1000000000
    };
    let xtreamerTransform = xtreamer(node, options);
    http.get(url, res => {
      /* The file that we get through ndw site is in a gzip format
       * We first need to unzip it.
       */
      res.pipe(gunzip).pipe(xtreamerTransform);
      // Then we pipe the unzipped file to xtreamer
      // and xtreamer extract each node with the node name given as a parameter
      xtreamerTransform.on('data', data => {
        let xmlSituation = data.toString();
        parseString(xmlSituation, {
          explicitArray: false
        }, (err, result) => {
          if (err) {
            reject(err);
          }
          // Apply the next function given as a parameter to the node
          next(result[node]);
        })
      });
      xtreamerTransform.on('end', () => {
        resolve('Database updated');
      })
    }).on('error', error => reject(error));
  })
}

module.exports = parse;
