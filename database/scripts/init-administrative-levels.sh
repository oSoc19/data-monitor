#!/bin/sh
# see https://github.com/cecemel/inventaris-dev/blob/master/postgres/scripts/init-premieaanvragen.sh

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"
export POSTGRES_DB="datamonitor"

psql -U "$POSTGRES_USER" -c "ALTER USER $POSTGRES_USER SET timezone='Europe/Brussels';"

# create db
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $POSTGRES_DB;
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL

# Load PostGIS into both template_database and $POSTGRES_DB
for DB in "$POSTGRES_DB"; do
  echo "Loading PostGIS extensions into $DB"
  "${psql[@]}" --dbname="$DB" <<-'EOSQL'
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
EOSQL
done

# let's assume this is still an issue, so just do it
for DB in "$POSTGRES_DB"; do
    echo "workaround for https://github.com/appropriate/docker-postgis/issues/58"
  "${psql[@]}" --dbname="$DB" <<-'EOSQL'
    ALTER EXTENSION postgis UPDATE;
    ALTER EXTENSION postgis_topology UPDATE;
EOSQL
done

#create table
for DB in "$POSTGRES_DB"; do
    "${psql[@]}" --dbname="$DB" <<-'EOSQL'
      CREATE TABLE administrative_boundaries (
        id SERIAL PRIMARY KEY,
        name varchar, level integer,
        geog geometry(MULTIPOLYGON));
EOSQL
done
