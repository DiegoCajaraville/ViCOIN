import argparse
import datetime
import time
import random
import cv2

#from influxdb import InfluxDBClient
#from gps import *
#from web3 import Web3
import RPi.GPIO as GPIO
#from mfrc522 import SimpleMFRC522

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
        
        GPIO.output(PIN_TIMBRE, False)
        
        # set up camera object
        cap = cv2.VideoCapture(0)
        # QR code detection object
        detector = cv2.QRCodeDetector()
        
    except:
        sys.exit("[ERROR] No se ha podido inicializar el estado del patinete. Revisa los pines del NFC o zumbador.")


    # PROGRAMA
    inicializated()
    print("[INFO] Esperando una lectura correcta de QR.")
    
    while True:
        
        # LECTURA DEL RECEPTOR #################
        try:
            # get the image and get bounding box coords and data
            _, img = cap.read()
            data, bbox, _ = detector.detectAndDecode(img)
        except:
            print("[ERROR] Fallo al obtener la imagen y decodificarla")
    
        # if there is a bounding box, draw one, along with the data
        if(bbox is not None and data):
            print("[SUCCESS] Información del QR:", data)
            
            #VALIDACION DE LA TRANSACCION
            print("[INFO] Procedemos a comprobar si el estado de la transacción es correcto")
            result = validateTransaction(data)
            
            if( result == 1):
                print("[INFO] La transacción es correcta. El usuario puede acceder al servicio.")
                activateSound(0.6, 1)
            else:
                print("[INFO] La transacción NO es correcta. El acceso al servicio por parte del usuario ha sido rechazado.")
                activateSound(0.15, 3)
            
            # Espera para que no haga la misma lectura 2 veces
            for i in range(10):
                cap.read()
            time.sleep(1)
            print("[INFO] Esperando una lectura correcta de QR.")
        
        if(cv2.waitKey(1) == ord("q")):
            break

    #cap.release()
    #cv2.destroyAllWindows()


###########################################################################################

def activateSound(duration, period):

    i = 1

    while(i <= period):
        GPIO.output(PIN_TIMBRE, True)
        time.sleep(duration)
        GPIO.output(PIN_TIMBRE, False)
        time.sleep(duration/3)
        i = i + 1

def inicializated():

    GPIO.output(PIN_TIMBRE, True)
    time.sleep(0.3)
    GPIO.output(PIN_TIMBRE, False)
    time.sleep(0.3/3)
    GPIO.output(PIN_TIMBRE, True)
    time.sleep(0.6)
    GPIO.output(PIN_TIMBRE, False)
    time.sleep(0.6/3)
    
###########################################################################################

def validateTransaction(transaction):

    return random.randint(0, 1)

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