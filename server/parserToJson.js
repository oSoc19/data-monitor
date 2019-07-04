const xml2js = require('xml2js');
const http = require("http");
const zlib = require("zlib");

const prefix = '<?xml version="1.0" encoding="UTF-8"?><SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/"><SOAP:Body>'
const sufix = '</SOAP:Body></SOAP:Envelope>'
// Remove the SOAP Envelope and Body
String.prototype.removePrefix = function(prefix) {
    const hasPrefix = this.indexOf(prefix) === 0;
    return hasPrefix ? this.substr(prefix.length) : this.toString();
};
String.prototype.removeSufix = function(prefix) {
    const hasPrefix = this.indexOf(prefix) === this.length - prefix.length;
    return hasPrefix ? this.substr(0, this.length - prefix.length) : this.toString();
};

/**
 * Parse a xml datex2 feed into a json-ld feed
 * @param  {string} source  a valid URL that goes to an xml datex2 feed
 * @return {Promise}        will return the json once parsing has completed
 */
function parse(url) {
    return new Promise((resolve, reject) => {
        // Get the requested source datafeed and unzip the body
        getGzipped(url, response => {
            response = response.removePrefix(prefix);
            response = response.removeSufix(sufix);
            // Options for parsing the xml
            const parser = new xml2js.Parser({
                mergeAttrs: true,
                explicitArray: false,
                tagNameProcessors: [xml2js.processors.stripPrefix],
                attrNameProcessors: [xml2js.processors.stripPrefix],
                attrValueProcessors: [xml2js.processors.stripPrefix]
            });

            // Parse the body of the request as xml to json 
            parser.parseString(response, (err, result) => {
                if (err) {
                    reject(new Error(`error while parsing xml.\n ${JSON.stringify(err)}`));
                }
                resolve(result);
            });
        })
    })

}

/*
 * Fetch a compressed file from the URL and unzip it
 * @param {string} URL of the file
 * @param {function} callback
 */
function getGzipped(url, callback) {
    // buffer to store the streamed decompression
    var buffer = [];

    http.get(url, function(res) {
        // pipe the response into the gunzip to decompress
        var gunzip = zlib.createGunzip();
        res.pipe(gunzip);

        gunzip.on('data', function(data) {
            // decompression chunk ready, add it to the buffer
            buffer.push(data.toString());

        }).on("end", function() {
            // response and decompression complete, join the buffer and return
            let res = buffer.join("");
            callback(res);

        }).on("error", function(e) {
            callback(e);
        })
    }).on('error', function(e) {
        callback(e);
    });
}

module.exports = parse;
