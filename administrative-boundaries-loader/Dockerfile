FROM python:3.7

RUN apt-get update
RUN apt-get install unzip -y
RUN apt-get install libpq-dev -y

COPY ./data/ /data/

RUN unzip data/nl.zip -d data
COPY ./requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY ./load-administrative-regions.py load-administrative-regions.py

CMD ["python3","load-administrative-regions.py"]