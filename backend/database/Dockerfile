FROM mdillon/postgis:9.6
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# hello
RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./scripts/ /docker-entrypoint-initdb.d/

EXPOSE 5432