FROM mdillon/postgis:9.6
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./scripts/ /docker-entrypoint-initdb.d/

EXPOSE 5432