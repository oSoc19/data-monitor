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
                "status" : true,
                "situationRecords": []
            }
            if (Math.round(Math.random())) {
                bridge.status = false;
            }
            data.push(bridge);
        }
        let now = new Date();
        let situationRecordTime =  element.situationRecord.validity.validityTimeSpecification.overallEndTime;
        if(situationRecordTime != undefined) {
            situationRecordTime = situationRecordTime.substring(0, situationRecordTime.length-1)
            situationRecordTime = new Date(situationRecordTime);
            if (situationRecordTime.getTime() >= now.getTime()) {
                bridge.situationRecords.push(element.situationRecord)
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