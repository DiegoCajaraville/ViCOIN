import argparse
import datetime
import time
import random
import cv2
import requests
import json

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

URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri
CHAIN_ID = '5' # (Ropsten = 3, Rinkeby = 4, Goerli = 5)

#PIN_NFC = 16
PIN_TIMBRE = 23

###########################################################################################

def main():

    # INICIALIZACION 

    if( CHAIN_ID == '3'):
        infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA
    elif( CHAIN_ID == '4'):
        infura_url = 'https://rinkeby.infura.io/v3/' + URI_INFURA
    elif( CHAIN_ID == '5'):
        infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA
    else:
        infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA

    try:
        print("[INFO] Inicializando pines de conexión")
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(PIN_TIMBRE, GPIO.OUT)
        
        GPIO.output(PIN_TIMBRE, False)
    except:
        sys.exit("[ERROR] No se ha podido inicializar los pines de conexión de la Raspberry Pi. Revisa los pines del zumbador.")

    try:
        print("[INFO] Inicializando la cámara de la Raspberry Pi")
        # set up camera object
        cap = cv2.VideoCapture(0)
        # QR code detection object
        detector = cv2.QRCodeDetector()
    except:
        sys.exit("[ERROR] No se ha podido inicializar la cámara de la Raspberry Pi. Revisa la conexión USB correspondiente o reinicia la Raspberry.")


    # PROGRAMA
    inicializated()
    print("[INFO] Esperando una lectura correcta de QR...")
    
    while True:
        
        # LECTURA DEL RECEPTOR #################
        try:
            # get the image and get bounding box coords and data
            _, img = cap.read()
            data, bbox, _ = detector.detectAndDecode(img)
        except:
            print("[ERROR] Fallo al obtener la imagen y decodificarla")
            break
    
        # if there is a bounding box, draw one, along with the data
        if(bbox is not None and data):

            hash = "0x" + data
            print("[SUCCESS] Información del QR: ", hash)

            if( len(hash) != 66 ):
                print("[ERROR] La información contenida en el QR no corresponde con un hash")
                activateSound(0.15, 3)
                break
            
            #VALIDACION DE LA TRANSACCION
            print("[INFO] Procedemos a comprobar si el estado de la transacción es correcto")
            result = comprobarTransaccion(hash, infura_url)
            
            if( result == True ):
                print("[INFO] La transacción es correcta. El usuario puede acceder al servicio.")
                activateSound(0.6, 1)
            else:
                print("[INFO] La transacción NO es correcta. El acceso al servicio por parte del usuario ha sido rechazado.")
                activateSound(0.15, 3)
            
            # Espera para que no haga la misma lectura 2 veces
            for i in range(10):
                cap.read()
            time.sleep(1)
            print("[INFO] Esperando una lectura correcta de QR...")
        
        if(cv2.waitKey(1) == ord("q")):
            break

    cap.release()
    cv2.destroyAllWindows()


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

def getTransactionByHash(hash, url):

    """""
    curl https://goerli.infura.io/v3/{ID}
    -X POST 
    -H "Content-Type: application/json" 
    --data '{"method":"eth_getTransactionByHash","params":["0x04b713fdbbf14d4712df5ccc7bb3dfb102ac28b99872506a363c0dcc0ce4343c"],"id":1,"jsonrpc":"2.0"}'
    """""
    transaction = '{"method":"eth_getTransactionByHash","params":["' + hash + '"],"id":' + CHAIN_ID + ',"jsonrpc":"2.0"}'

    response = requests.post(url, data = transaction, headers = {"Content-Type": "application/json"})
    status = response.status_code
    transaction = response.text

    print("Status code: " + str(status))
    print("Response: " + str(transaction))

    return status, transaction


def comprobarTransaccion(hash, url):

    status, data = getTransactionByHash(hash, url)

    # Comprobamos que haya devuelto una respuesta esperada
    if( status < 200 or status >= 300 ):
        print("[ERROR] Infura no ha devuelto una respuesta esperada.")
        return False

    # Comprobamos que se ha encontrado una transaccion con dicho Hash
    data = json.loads(data)
    transaction = data["result"]

    if( transaction == None ):
        print("[ERROR] No se ha encontrado una transacción con dicho hash.")
        return False

    # Extraemos los campos y comprobamos que sean correctos los campos

    #entrada = json.loads(entrada)
    #entrada['to'] = "0xc15648cfe1afc36eddabc5a79c5f33480bf24ce0"
    #print(entrada["r"])    

    #gas = int( transaccion["gas"], 16) # Hexadecimal to decimal
    #print(gas)

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