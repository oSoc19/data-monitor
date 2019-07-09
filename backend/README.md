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

### Running in devlop mode
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d  # will start in daemon mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up logs -f --tail=200 # will tail logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart api # if you want to restart a service, better do it in another terminal
```

Each service has will have its specific quirks.

### api service
To go and debug this, use chrome and go to
```
chrome://inspect/#devices
```