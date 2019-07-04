const xml2js = require('xml2js');
const http = require("http");
const zlib = require("zlib");

/**
 * The json-ld context used for all of the terms
 * todo: make sure that every possible term is available here
 * report to https://github.com/OpenTransport/linked-datex2
 * @type {Object}
 */
const context = {
    '@vocab': 'http://vocab.datex.org/terms#'
};

const prefix = '<?xml version="1.0" encoding="UTF-8"?><SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/"><SOAP:Body>'
const sufix = '</SOAP:Body></SOAP:Envelope>'
// Remove the SOAP Envelope and Body
String.prototype.removePrefix = function (prefix) {
    const hasPrefix = this.indexOf(prefix) === 0;
    return hasPrefix ? this.substr(prefix.length) : this.toString();
};
String.prototype.removeSufix = function (prefix) {
    const hasPrefix = this.indexOf(prefix) === this.length - prefix.length;
    return hasPrefix ? this.substr(0, this.length - prefix.length) : this.toString();
};

/**
 * Parse a xml datex2 feed into a json-ld feed
 * @param  {string} source  a valid URL that goes to an xml datex2 feed
 * @param  {string} baseuri the baseuri that contains each identifier (as a hash)
 * @param  {[object]} sourceOptions any of the `http.request` options.
 * @return {Promise}        will return the json-ld once parsing has completed
 */
function parse(url, baseuri, sourceOptions) {
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

            // Parse the body of the request as xml to json with options
            parser.parseString(response, (err, result) => {
                if (err) {
                    reject(new Error(`error while parsing xml.\n ${JSON.stringify(err)}`));
                }

                const data = addLinksToIds(result, baseuri);

                resolve({
                    "@context": context,
                    "@graph": data
                });
            });
        })
    })

}

/**
 * Change id's into @id with uri
 * @param  {object} json  the json that needs to be transformed
 * @param  {string} base  url that has terms as a hash
 * @return {object}       the transformed object
 */
function addLinksToIds(json, base) {
    function recurse(out) {
        for (const inner in out) {
            if (Object.prototype.hasOwnProperty.call(out, inner)) {
                // If the current child contains more nesting, we need to continue
                if (typeof out[inner] === 'object') {
                    recurse(out[inner]);
                }
                // If the current key is `id`, we need to transform it
                if (inner === 'id') {
                    // Make a new `@id` child that links to this identifier
                    out['@id'] = base + '#' + out[inner];
                    // Remove the original `id` child
                    out[inner] = undefined;
                }
            }
        }
    }
    recurse(json);
    return json;
}

function getGzipped(url, callback) {
    // buffer to store the streamed decompression
    var buffer = [];

    http.get(url, function (res) {
        // pipe the response into the gunzip to decompress
        var gunzip = zlib.createGunzip();
        res.pipe(gunzip);

        gunzip.on('data', function (data) {
            // decompression chunk ready, add it to the buffer
            buffer.push(data.toString());

        }).on("end", function () {
            // response and decompression complete, join the buffer and return
            let res = buffer.join("");
            callback(res);

        }).on("error", function (e) {
            callback(e);
        })
    }).on('error', function (e) {
        callback(e);
    });
}

module.exports = parse;