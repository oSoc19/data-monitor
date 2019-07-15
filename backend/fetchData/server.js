const express = require('express');
const bridge = require('./index')
const cron = require('cron')

let app = express();
bridge.associateModels();
const CRON_FREQUENCY = process.env.CRON_PATTERN || '0 */15 * * * *';

app.get("/import/bridges", (req, res, next) => {
  bridge.loadBridges();
  return res.send({"Loading":"Ok"});
});

new cron.CronJob(CRON_FREQUENCY, async function() {
  console.log(`Bridges loaded by cron job at ${new Date().toISOString()}`);
  await bridge.loadBridges();
}, null, true);


app.listen(8080, () => console.log('FetchData pipeline listening on port 8080'))