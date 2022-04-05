import argparse
import datetime
import time
import random
import json
import requests

#from influxdb import InfluxDBClient
#from gps import *
#from web3 import Web3

# VARIABLES GLOBALES
#HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
#PORT = 8086
#USER = 'admin'
#PASSWORD = 'lproPassword'
#DBNAME = 'ViCOIN'
#MEASUREMENT = 'patinetes'

URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri
CHAIN_ID = '5' # (Ropsten = 3, Rinkeby = 4, Goerli = 5)

PIN_TIMBRE = 23

###########################################################################################

def main():

    while True:

        # Inicializacion
        if( CHAIN_ID == '3'):
            infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA
        elif( CHAIN_ID == '4'):
            infura_url = 'https://rinkeby.infura.io/v3/' + URI_INFURA
        elif( CHAIN_ID == '5'):
            infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA
        else:
            infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA

        # LECTURA DEL QR #################
        print("[INFO] Esperando a que el NFC haga alguna lectura")
        lectura = 'd3b2df0fe99a7657c6ccdcfd1b94d974a5a6011829ffd501ed08e4d901a3479c'

        # ADAPTACION DE LA ENTRADA #################
        print("[INFO] Lectura realizada: " + lectura)
        lectura = "0x" + lectura

        # COMPROBACIÓN VALIDEZ #################
        print("[INFO] Procedemos a comprobar si el estado de la transacción es correcto")

        if( comprobarTransaccion(lectura, infura_url) ):
            print("[INFO] La transacción es correcta. El usuario puede acceder al servicio.")
        else:
            print("[INFO] La transacción NO es correcta. El acceso al servicio por parte del usuario ha sido rechazado.")

        time.sleep(100)



###########################################################################################

def adaptarEntrada(entrada):

    entrada = json.loads(entrada)
    entrada['to'] = "0xc15648cfe1afc36eddabc5a79c5f33480bf24ce0"

    #print(entrada["r"])

    return entrada


def comprobarTransaccion(hash, url):

    """""
    curl https://goerli.infura.io/v3/{ID}
    -X POST 
    -H "Content-Type: application/json" 
    --data '{"method":"eth_getTransactionByHash","params":["0x04b713fdbbf14d4712df5ccc7bb3dfb102ac28b99872506a363c0dcc0ce4343c"],"id":1,"jsonrpc":"2.0"}'
    """""

    transaction = '{"method":"eth_getTransactionByHash","params":["' + hash + '"],"id":' + CHAIN_ID + ',"jsonrpc":"2.0"}'
    print("Transaction: " + transaction)

    response = requests.post(url, data = transaction, headers = {"Content-Type": "application/json"})

    print("Status code: " + str(response.status_code))
    print("Response: " + str(response.text))


    #gas = int( transaccion["gas"], 16) # Hexadecimal to decimal
    #print(gas)
    
    return True

###########################################################################################

def parse_args():

    """Parse the args."""
    parser = argparse.ArgumentParser(description='example code to play with InfluxDB')
    
    parser.add_argument('--idPatinete', type=str, required=True,
                        help='identification for the eScooter in the system')

    return parser.parse_args()


if __name__ == '__main__':
    #args = parse_args()
    #id=args.idPatinete
    main()


    """
    # RECUPERAR INFORMACION
    time.sleep(3)

    query = 'SELECT * FROM patinetes WHERE idPatinete=\'' + id + '\' ORDER BY time DESC LIMIT 1'
    print("Querying data: " + query)
    result = client.query(query, database=DBNAME)
    print("Result: {0}".format(result))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['altitud']))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['latitud']))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['bateria']))
    print("Result: {0}".format(list(result.get_points(measurement='patinete1'))[0]['velocidad']))

    print("Create database: " + DBNAME)
    client.create_database(DBNAME)

    print("Latitud: {0:.3f}".format(latitud))
    print("Longitud: {0:.3f}".format(longitud))
    print("Bateria: " + str(bateria))
    print("Velocidad: " + str(velocidad) + "\n")

    --------------------------
        global pruebas
    """

    