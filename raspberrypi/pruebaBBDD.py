import argparse
import datetime
import time
import random
import requests
import json

from influxdb import InfluxDBClient
#from gps import *
#from web3 import Web3
#from mfrc522 import SimpleMFRC522

# VARIABLES GLOBALES
HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
PORT = 8086
USER = 'admin'
PASSWORD = 'lproPassword'
DBNAME = 'ViCOIN'
MEASUREMENT = 'transporte'

URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri
CHAIN_ID = '5' # (Ropsten = 3, Rinkeby = 4, Goerli = 5)

#PIN_NFC = 16
PIN_TIMBRE = 23

###########################################################################################

def main():

    # INICIALIZACION 
    try:
        print("[INFO] Inicializando datos BBDD")
        client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME)
        client.switch_database(DBNAME)
    except:
        sys.exit("[ERROR] No se ha podido conectar con la BBDD. Revisa si los datos de conexión han cambiado o si el servicio AWS está activo.")


    ###print("Create database: " + DBNAME)
    ###client.create_database(DBNAME)

    data = '0xd3b2df0fe99a7657c6ccdcfd1b94d974a5a6011829ffd501ed08e4d901a3479c'
    ##sendInformationBBDD(client, data, "BUS")

    ## CHECK 1
    ##result = checkHashBBDD(client, data)

    ##if(result):
    ##    print("[SUCCESS] No se ha encontrado ningún registro previo")
    ##else:
    ##    print("[ERROR] Se ha encontrado un registro previo de la transaccion")

    #time.sleep(10)

    ## CHECK 2
    result = checkHashBBDD(client, '0xd3b2df0fe99a7657c6ccdcfd1b94d974a5a6011829ffd501ed08e4d901a3479d')

    if(result):
        print("[SUCCESS] No se ha encontrado ningún registro previo")
    else:
        print("[ERROR] Se ha encontrado un registro previo de la transaccion")


###########################################################################################

def sendInformationBBDD(client, hash, transporte):

    # ENVIAR INFORMACION #################
    now = datetime.datetime.today()
    points = []

    point = {
        "measurement": MEASUREMENT,
        "time": int(now.strftime('%s')),
        "fields": {
            "hash": hash,
            "transporte": transporte
        }
    }

    print(point)
    points.append(point)

    try:
        # Write points
        client.write_points(points)
        print("[INFO] Enviando datos a la BBDD")
    except:
        print("[ERROR] No se ha podido almacenar la información en la BBDD")


def checkHashBBDD(client, hash):

    query = 'SELECT * FROM ' + MEASUREMENT + ' WHERE hash=\'' + hash + '\' ORDER BY time DESC LIMIT 1'
    print("Querying data: " + query)

    result = client.query(query, database=DBNAME)

    listaHash = list(result.get_points(measurement=MEASUREMENT))

    if( len(listaHash) != 0 ):
        print("[INFO] Hash: {0}".format(listaHash[0]['hash']))
        print("[INFO] Transporte: {0}".format(listaHash[0]['transporte']))
        return False

    else:
        return True

###########################################################################################

def parse_args():

    """Parse the args."""
    parser = argparse.ArgumentParser(description='example code to play with InfluxDB')
    
    parser.add_argument('--test', type=int, required=False,
                        help='testing')

    return parser.parse_args()


if __name__ == '__main__':
    #args = parse_args()
    #test=args.test
    main()