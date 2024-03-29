import argparse
import datetime
import time
import random

#from influxdb import InfluxDBClient
#from gps import *
#from web3 import Web3
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

# VARIABLES GLOBALES
#HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
#PORT = 8086
#USER = 'admin'
#PASSWORD = 'lproPassword'
#DBNAME = 'ViCOIN'
#MEASUREMENT = 'patinetes'

#URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri
#CHAIN_ID = '3' # (Ropsten = 3, Rinkeby = 4, Goerli = 5)

#PIN_NFC = 16
PIN_TIMBRE = 23

###########################################################################################

def main():

    try:
        print("[INFO] Inicializando pines de conexión")
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        #GPIO.setup(PIN_NFC, GPIO.IN)
        GPIO.setup(PIN_TIMBRE, GPIO.OUT)
        
        reader = SimpleMFRC522()
        
    except:
        sys.exit("[ERROR] No se ha podido inicializar el estado del patinete. Revisa los pines del NFC o zumbador.")


    # PROGRAMA

    GPIO.output(PIN_TIMBRE, False)

    while True:

        # LECTURA DEL RECEPTOR #################
        print("[INFO] Esperando a que el NFC haga alguna lectura")
        
        identificador, lectura = reader.read()
        print("Identificador: " + str(identificador))


        print("[INFO] Lectura realizada: " + str(lectura))

        # COMPROBACIÓN VALIDEZ #################
        print("[INFO] Procedemos a comprobar si el estado de la transacción es correcto")

        # random.randint(0, 1)
        if( int(lectura) == 1):
            print("[INFO] La transacción es correcta. El usuario puede acceder al servicio.")
            activateSound(0.6, 1)
        else:
            print("[INFO] La transacción NO es correcta. El acceso al servicio por parte del usuario ha sido rechazado.")
            activateSound(0.15, 3)


###########################################################################################

def activateSound(duration, period):

    i = 1

    while(i <= period):
        GPIO.output(PIN_TIMBRE, True)
        time.sleep(duration)
        GPIO.output(PIN_TIMBRE, False)
        time.sleep(duration/3)
        i = i + 1

###########################################################################################

def parse_args():

    """Parse the args."""
    parser = argparse.ArgumentParser(description='example code to play with InfluxDB')
    
    parser.add_argument('--test', type=int, required=True,
                        help='testing')

    return parser.parse_args()


if __name__ == '__main__':
    #args = parse_args()
    #test=args.test
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

    