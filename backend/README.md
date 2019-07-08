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
docker-compose run
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


### api service
