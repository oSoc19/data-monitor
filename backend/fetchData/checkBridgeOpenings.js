const checkAllFields = bridgeEvent => {
  let bridgeEventKeys = Object.values(bridgeEvent.dataValues)
  let count = 0;
  for (let value of bridgeEventKeys) {
    if (value !== undefined & value !== null & value !== '') {
      count++;
    }
  }
  return ((count - 2) / (bridgeEventKeys.length - 2));
}

module.exports = checkAllFields;

