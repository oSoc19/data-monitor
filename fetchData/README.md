# Fetch data

## Fetch
The fetch_data service fetches the data from the [NDW website](http://opendata.ndw.nu/). It then convert it into JSON objects.

## Database and checks
It creates then the tables in the database with the object models and checks them with the checks models.

## Cron Job
A cron job is set up so every hour, all the data is refreshed.