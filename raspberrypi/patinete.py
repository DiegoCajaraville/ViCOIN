import argparse
import datetime
import time

from influxdb import InfluxDBClient

#import math


HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
PORT = 8086
USER = 'admin'
PASSWORD = 'lproPassword'
DBNAME = 'patinetes'


def main(id):

    measurement = "patinete" + id
    timeoutBlockchain = 0

    try:
        client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME)
        client.switch_database(DBNAME)
    except:
        print("No se ha podido conectar con la BBDD")

    while True:

        # ENVIAR INFORMACION
        if(timeoutBlockchain == 0):
            print("Llamada a la blockchain")
            timeoutBlockchain = 6

        now = datetime.datetime.today()
        points = []

        point = {
            "measurement": measurement,
            "time": int(now.strftime('%s')),
            "fields": {
                "altitud": 189.12,
                "latitud": -82.123,
                "bateria": 91,
                "velocidad": 12
            }
        }
        
        points.append(point)

        try:
            # Write points
            client.write_points(points)
        except:
            print("No se ha podido almacenar la información en la BBDD")

        
        # Actualizamos estado 
        timeoutBlockchain = timeoutBlockchain - 1
        time.sleep(5)


def parse_args():

    """Parse the args."""
    parser = argparse.ArgumentParser(description='example code to play with InfluxDB')
    
    parser.add_argument('--idPatinete', type=str, required=True,
                        help='identification for the eScooter in the system')

    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    main(id=args.idPatinete)


    """
    # RECUPERAR INFORMACION
    time.sleep(3)

    query = 'SELECT * FROM ' + measurement + ' ORDER BY time DESC LIMIT 1'
    print("Querying data: " + query)
    result = client.query(query, database=DBNAME)
    print("Result: {0}".format(result))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['altitud']))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['latitud']))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['bateria']))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['velocidad']))

    print("Create database: " + DBNAME)
    client.create_database(DBNAME)
    """