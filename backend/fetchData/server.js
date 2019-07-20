const express = require('express');
const fetchData = require('./index');
const cron = require('cron');

let app = express();
fetchData.associateModels();
console.log(`Loading bridges ${new Date().toISOString()}`);
// fetchData.loadBridges();
// console.log(`Loading maintenance works ${new Date().toISOString()}`);
// fetchData.loadMaintenanceWorks();
// console.log(`Loading accidents ${new Date().toISOString()}`);
fetchData.loadAccident();
const CRON_FREQUENCY = process.env.CRON_PATTERN || '0 */60 * * * *';

app.get("/import/bridges", (req, res) => {
  // console.log(`Loading bridges ${new Date().toISOString()}`);
  // fetchData.loadBridges();
  // console.log(`Loading road maintenance ${new Date().toISOString()}`);
  // fetchData.loadMaintenanceWorks();
  console.log(`Loading accidents ${new Date().toISOString()}`);
  fetchData.loadAccident();
  return res.send({
    "Loading": "Ok"
  });
});

new cron.CronJob(CRON_FREQUENCY, async function() {
  console.log(`Data loaded by cron job at ${new Date().toISOString()}`);
  // await fetchData.loadBridges();
  // await fetchData.loadMaintenanceWorks();
  await fetchData.loadAccident();
}, null, true);

app.listen(8080, () => console.log('FetchData pipeline listening on port 8080'));

