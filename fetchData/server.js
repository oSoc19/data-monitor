const express = require('express');
const fetchData = require('./index');
const cron = require('cron');

let app = express();
// Load all the dataset in the database when fetch_data is launched
(async () => {
  fetchData.associateModels();
  console.log(`Loading bridges ${new Date().toISOString()}`);
  await fetchData.loadBridges();
  console.log(`Loading accidents ${new Date().toISOString()}`);
  await fetchData.loadAccident();
  console.log(`Loading maintenance works ${new Date().toISOString()}`);
  fetchData.loadMaintenanceWorks();
})();

const CRON_FREQUENCY = process.env.CRON_PATTERN || '0 */60 * * * *';

new cron.CronJob(CRON_FREQUENCY, async function() {
  console.log(`Data loaded by cron job at ${new Date().toISOString()}`);
  await fetchData.loadBridges();
  await fetchData.loadAccident();
  await fetchData.loadMaintenanceWorks();
}, null, true);

app.listen(8080, () => console.log('FetchData pipeline listening on port 8080'));
