# Backend for data-monitor

The backend runs in docker and docker-compose

## Basic running
### Building

The first time you need to build your backend.
```
docker-compose build
```

### Running
```
docker-compose up
```

### Stopping
```
docker-compose stop
```

### cleaning up

This is the agressive command, there are more subtle ones.
```
docker-compose down
```
This will keep the data in the data folder.
The data folder is kept locally, and not included in git.


## Developing

The development mode depends on the type of service. The config of each service to run in development mode, is in the docker-compose.dev.yml file.

Always make sure you build your images before.

Also note: debugging API service and fetch_data service is difficult at the same time.

### before developing
You will need to make a docker-compose.override.yml, where local config will be stored.

### Dev api service
Config docker-compose.override.yml:
```
version: "3.4"
services:
  api:
    ports:
      - 8888:8080
      - 9229:9229
```
Running
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml up -d  # will start in daemon mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml up logs -f --tail=200 # will tail logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml restart api # if you want to restart a service, better do it in another terminal
```
To go and debug this, use chrome and go to
```
chrome://inspect/#devices
```

### Dev fetch_data service
Config docker-compose.override.yml:
```
version: "3.4"
services:
  fetch_data:
    ports:
      - 8888:8080
      - 9229:9229
```
Running
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml up -d  # will start in daemon mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml up logs -f --tail=200 # will tail logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml restart api # if you want to restart a service, better do it in another terminal
```
To go and debug this, use chrome and go to
```
chrome://inspect/#devices
```


## making configurations local to your machine.
Suppose you want to access the DB directly, you can use a docker-compose.override.yml.
This file will keep track of your changes, and won't be commit to git.

```
version: "3.4"
services:
  database:
    ports:
      - 5432:5432
```
To take these into account, you can run:
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.override.yml up -d  # will start in daemon mode
```
Please note: there are shorter ways, but leave em like it is for now.


### useful commands
Connect locally from your machine to database (assumes an update docker-compose.override.yml)
```
 psql -h localhost -p 5432 -U postgres
```