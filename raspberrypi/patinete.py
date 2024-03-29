import argparse
import datetime
import time
import random
import threading
import json

from influxdb import InfluxDBClient
from gps import *
from web3 import Web3
import RPi.GPIO as GPIO
import Adafruit_DHT

# VARIABLES GLOBALES
#HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
#PORT = 8086
HOST = 'lpro.diegocajaraville.cyou'
PORT = 8089
USER = 'admin'
PASSWORD = 'lproPassword'
DBNAME = 'ViCOIN'
MEASUREMENT = 'servicioPatinetes'

URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri
CHAIN_ID = '5' # (Ropsten = 3, Rinkeby = 4, Goerli = 5)

SAVE_DATA = 10
CHECK_BLOCKCHAIN = 20
CHECK_TEMPERATURE = 15

PIN_STATE_SCOOTER = 21
PIN_TIMBRE = 23
PIN_TEMPERATURE = 4
PIN_VENTILADOR = 17

TEMPERATURA_MAX = 20

###########################################################################################

def main(id):

    # INICIALIZACION 
    
    if( CHAIN_ID == '3'):
        infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA
        rutaTarifas = '/home/pi/Desktop/contracts/ropsten/Tarifas.json'
    elif( CHAIN_ID == '4'):
        infura_url = 'https://rinkeby.infura.io/v3/' + URI_INFURA
        rutaTarifas = '/home/pi/Desktop/contracts/rinkeby/Tarifas.json'
    elif( CHAIN_ID == '5'):
        infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA
        rutaTarifas = '/home/pi/Desktop/contracts/goerli/Tarifas.json'
    else:
        infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA
        rutaTarifas = '/home/pi/Desktop/contracts/goerli/Tarifas.json'

    try:
        print("[INFO] Inicializando datos BBDD")
        client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME)
        client.switch_database(DBNAME)
    except:
        sys.exit("[ERROR] No se ha podido conectar con la BBDD. Revisa si los datos de conexión han cambiado o si el servicio AWS está activo.")

    try:
        print("[INFO] Inicializando datos GPS")
        gpsd = gps(mode=WATCH_ENABLE|WATCH_NEWSTYLE)
    except:
        sys.exit("[ERROR] No se ha podido inicializar el módulo GPS. Revisa los PINES de la conexión con el módulo GPS.")

    try:
        print("[INFO] Inicializando conexión Blockchain")
        w3 = Web3(Web3.HTTPProvider(infura_url))
        json_file = open(rutaTarifas)
        info_json = json.load(json_file)
        direccionTarifas = info_json['networks'][CHAIN_ID]['address']
        abi = info_json['abi']
        contract = w3.eth.contract(address=direccionTarifas,abi=abi)
    except:
        sys.exit("[ERROR] No se ha podido inicializar el servicio de Infura. Revisa los datos de conexión a la red Blockchain, así como el fichero del SmartContract.")

    try:
        print("[INFO] Inicializando pines de conexión")
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(PIN_STATE_SCOOTER, GPIO.OUT)
        GPIO.setup(PIN_TIMBRE, GPIO.OUT)
        GPIO.setup(PIN_VENTILADOR, GPIO.OUT)
    except:
        sys.exit("[ERROR] No se ha podido inicializar el estado del patinete. Revisa el PIN del Rele.")


    # PROGRAMA

    inicializated()

    ## Tiempo que pasa entre cada guardado en la BBDD       -> SAVE_DATA segundos
    hiloBBDD = threading.Thread(target=sendInformationBBDD, args=(client, gpsd, id,))
    hiloBBDD.start()

    ## Tiempo que pasa entre cada llamada a la Blockchain   -> CHECK_BLOCKCHAIN segundos
    hiloInfura = threading.Thread(target=updateState, args=(contract, id,))
    hiloInfura.start()

    ## Tiempo que pasa cada vez que comprobamos la temperatura   -> CHECK_TEMPERATURE segundos
    hiloTemperatura = threading.Thread(target=checkTemperature, args=())
    hiloTemperatura.start()


###########################################################################################

def changeStateScooter(state):

    if(state == True):
        print("[INFO] Activando el motor del patinete")
    else:
        print("[INFO] Desactivando el motor del patinete")

    try:
        GPIO.output(PIN_STATE_SCOOTER, state)
    except:
        print("[ERROR] Error al cambiar el estado del patinete")


def updateState(contract, id):

    tiempoRestante = 0
    state = False
    changeStateScooter(state)

    while True:

        # LLAMADA A LA BLOCKCHAIN Y GESTIÓN RELE #################
        try:

            print("[INFO] Llamada al SmartContract Tarifas en la Blockchain")
            tiempoRestante = contract.functions.remaining(int(id)).call()
            print("[INFO] El tiempo restante asociado a este patinete es: " + str(tiempoRestante))

        except:
            print("[ERROR] No se ha podido realizar la lamada al SmartContract Tarifas en la Blockchain")
            time.sleep(CHECK_BLOCKCHAIN)
            continue

        # Se ha acabado el tiempo del servicio, hasta ahora activo
        if( (tiempoRestante == 0) and (state == True) ):
            print("[INFO] El patinete ha dejado de tener servicio")
            state = False
            changeStateScooter(state)
        # El patinete está desactivado, pero tampoco ha recibido una nueva petición
        elif( tiempoRestante == 0 ):
            print("[INFO] El patinete no tiene un servicio contratado")
        # El patinete está desactivado, pero recibe nuevo servicio
        elif( (tiempoRestante != 0) and (state == False) ):
            print("[INFO] Nuevo servicio contratado: " + str(tiempoRestante))
            state = True
            changeStateScooter(state)
            activateSound(0.6, 1)
        # El patinete está activado y aun queda tiempo de servicio
        else:
            print("[INFO] Tiempo restante del servicio: " + str(tiempoRestante))
            if(tiempoRestante <= 30):
                activateSound(0.15, 3)

        time.sleep(CHECK_BLOCKCHAIN)


###########################################################################################

def sendInformationBBDD(client, gpsd, id):

    lastLatitud = random.uniform(42.22, 42.24)
    lastLongitud = random.uniform(-8.74, -8.72)
    lastVelocidad = 0

    while True:

        # OBTENER INFORMACIÓN DEL GPS #################
        datosGPS = getDataGPS(gpsd)

        if(datosGPS[0] == None or datosGPS[1] == None or datosGPS[2] == None):
            print("[WARN] No se han podido obtener datos del GPS")
            latitud = lastLatitud
            longitud = lastLongitud
            velocidad = lastVelocidad
        else:
            print("[INFO] Se han podido obtener datos del GPS")
            latitud = datosGPS[0]
            longitud = datosGPS[1]
            velocidad = datosGPS[2]
            lastLatitud = latitud
            lastLongitud = longitud    
            lastVelocidad = velocidad 

        # OBTENER INFORMACIÓN DEL CONTROLADOR #################
        bateria = random.randint(0, 100)
        #velocidad = random.randint(0, 50)

        # ENVIAR INFORMACION #################
        now = datetime.datetime.today()
        points = []

        point = {
            "measurement": MEASUREMENT,
            "time": int(now.strftime('%s')),
            "fields": {
                "latitud": str("{:.6f}".format(latitud)),
                "longitud": str("{:.6f}".format(longitud)),
                "bateria": str(bateria),
                "velocidad": str(velocidad),
                "idPatinete": id
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

        time.sleep(SAVE_DATA)


def getDataGPS(gpsd):

    try:
        nx = gpsd.next()
        if nx['class'] == 'TPV' :
            latitud = getattr(nx, 'lat', None)
            longitud= getattr(nx, 'lon', None)
            velocidad= getattr(nx, 'speed', None)
            print("lon = " + str(longitud) + ", lat = " +  str(latitud) + ", speed = " +  str(velocidad))
            return [latitud, longitud, velocidad]
        else:
            return [None, None, None]
    except:
        print("[ERROR] Error al obtener información del GPS")
        return [None, None, None]


###########################################################################################

def checkTemperature():

    sensor = Adafruit_DHT.DHT11
    GPIO.output(PIN_VENTILADOR, False)

    while True:

        humedad, temperatura = Adafruit_DHT.read_retry(sensor, PIN_TEMPERATURE)
        print("[INFO] La temperatura actual es: " + str(temperatura))

        if( temperatura >= TEMPERATURA_MAX ):
            GPIO.output(PIN_VENTILADOR, True)
        else:
            GPIO.output(PIN_VENTILADOR, False)

        time.sleep(CHECK_TEMPERATURE)


###########################################################################################

def inicializated():

    GPIO.output(PIN_TIMBRE, True)
    time.sleep(0.3)
    GPIO.output(PIN_TIMBRE, False)
    time.sleep(0.3/3)
    GPIO.output(PIN_TIMBRE, True)
    time.sleep(0.6)
    GPIO.output(PIN_TIMBRE, False)
    time.sleep(0.6/3)

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
    
    parser.add_argument('--idPatinete', type=str, required=True,
                        help='identification for the eScooter in the system')

    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    main(id=args.idPatinete)


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

    