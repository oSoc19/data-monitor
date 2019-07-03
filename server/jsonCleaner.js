function cleanBridgeData(obj) {
    let data = {};
    let bridges = obj["@graph"].d2LogicalModel.payloadPublication.situation;
    bridges.forEach(element => {
        let coord = element.situationRecord.groupOfLocations.locationForDisplay;
        // console.log(coord);
        let bridge = data[coord.longitude + "," + coord.latitude]
        if (bridge === undefined) {
            bridge = {
                "situationRecords": []
            }
            data[coord.longitude + "," + coord.latitude] = bridge
        }
        let now = new Date();
        let situationRecordTime = new Date(element.situationRecord.validity.validityTimeSpecification.overallEndTime);
        if (situationRecordTime.getTime() >= now.getTime()) {
            bridge.situationRecords.push(element.situationRecord)
        }
    });
    // console.log(bridges)
    return data;
}

module.exports = cleanBridgeData;