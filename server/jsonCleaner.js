const hash = require('string-hash')

function cleanBridgeData(obj) {
    let data = [];
    let bridges = obj["@graph"].d2LogicalModel.payloadPublication.situation;
    bridges.forEach(element => {
        let coord = element.situationRecord.groupOfLocations.locationForDisplay;
        // console.log(coord);
        let bridge = findBridge(data, coord.longitude + "," + coord.latitude);
        if (bridge === null) {
            bridge = {
                "id" : hash(coord.longitude + "," + coord.latitude),
                "location": coord,
                "status" : false,
                "situationRecords": []
            }
            data.push(bridge);
        }
        let now = new Date();
        let startTime = element.situationRecord.validity.validityTimeSpecification.overallStartTime;
        let endTime =  element.situationRecord.validity.validityTimeSpecification.overallEndTime;
        if(endTime != undefined && startTime != undefined) {
            endTime = endTime.substring(0, endTime.length-1) // remove the last character
            endTime = new Date(endTime);
            startTime = startTime.substring(0, startTime.length-1);
            startTime = new Date(startTime);
            if (endTime.getTime() >= now.getTime()) {
                bridge.situationRecords.push(element.situationRecord);
                bridge.status = (startTime.getTime() <= now.getTime()) ? true:false
            }
        }
    });
    // console.log(bridges)
    return data;
}

function findBridge(bridges, str) {
    let id = hash(str);
    bridges.forEach(element => {
        if (element.id === id) {
            return id
        }
    });
    return null;
}

module.exports = cleanBridgeData;