import json
import os
import psycopg2
import time
#import pdb; pdb.set_trace()


POSTGRES_HOST = "database"
POSTGRES_USER = os.environ["POSTGRES_USER"]
POSTGRES_PASSWORD = os.environ["POSTGRES_PASSWORD"]
DB = "datamonitor"
DATA_DIR = "data"


def load_data():
    wait_for_db()

    #only load once
    if is_data_there():
        print("We found table with data already in there, nothing to do")
        return

    pathz = get_all_json_paths(DATA_DIR)
    for p in pathz:
        geojson = load_json_file(p)
        insert_record(geojson["properties"]["name"],
                      geojson["properties"]["admin_level"],
                      json.dumps(geojson["geometry"]))

    print("----- All data loaded, whoop!")


def get_all_json_paths(base_dir):
    pathz = [os.path.abspath(os.path.join(base_dir, x)) for x in os.listdir(base_dir)]
    return [f for f in pathz if 'GeoJson' in f]


def load_json_file(path):
    with open(path) as json_file:
        return json.load(json_file)


def insert_record(name, level, geo):
    try:
        connection = psycopg2.\
               connect(user=POSTGRES_USER,
                       password=POSTGRES_PASSWORD,
                       host=POSTGRES_HOST,
                       database=DB)
        cursor = connection.cursor()
        postgres_insert_query = """
          INSERT INTO administrative_boundaries (NAME, LEVEL, GEOG)
                     VALUES (%s,%s,
                              ST_GeomFromGeoJSON(%s))
         """
        record_to_insert = (name, level, geo)
        cursor.execute(postgres_insert_query, record_to_insert)
        connection.commit()
        count = cursor.rowcount
        print(count, "Record inserted successfully into table")
    except (Exception, psycopg2.Error) as error:
        if(connection):
            print("Failed to insert record into table", error)
    finally:
        # closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def is_data_there():
    connection = psycopg2.\
               connect(user=POSTGRES_USER,
                       password=POSTGRES_PASSWORD,
                       host=POSTGRES_HOST,
                       database=DB)
    cursor = connection.cursor()
    query = """SELECT COUNT(*) FROM  administrative_boundaries"""
    cursor.execute(query)
    return cursor.rowcount > 0


def is_db_ready():
    try:
        conn = psycopg2.connect("host={} user={} password={}".format(POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD))
        conn.close()
        return True

    except psycopg2.OperationalError as ex:
        print("Connection failed: {0}".format(ex))
        return False


def wait_for_db():
    max_attempts = 40
    attempts = 0
    while not is_db_ready() or attempts > max_attempts:
        print("db not ready, waiting..")
        attempts += 1
        time.sleep(10)

    if attempts > max_attempts:
        raise Exception("db not ready giving up")


if __name__ == "__main__":
    load_data()
