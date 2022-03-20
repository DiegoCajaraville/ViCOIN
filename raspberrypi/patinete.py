import argparse
import datetime
import time
import random

from influxdb import InfluxDBClient
from gps import *
from web3 import Web3
import RPi.GPIO as GPIO

# VARIABLES GLOBALES
HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
PORT = 8086
USER = 'admin'
PASSWORD = 'lproPassword'
DBNAME = 'ViCOIN'
MEASUREMENT = 'patinetes'

DIR_CONTRATO_TARIFAS = '0xFe5d6C0D7b500f0F801d18E16f85E1EFBc275Ffa'
URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri

SAVE_DATA = 10
CHECK_BLOCKCHAIN = 6

PIN_STATE_SCOOTER = 21


def main(id):

    # Inicializacion
    timeoutBlockchain = 0
    infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA

    try:
        client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME)
        client.switch_database(DBNAME)
    except:
        sys.exit("No se ha podido conectar con la BBDD. Revisa si los datos de conexión han cambiado o si el servicio AWS está activo.")

    try:
        gpsd = gps(mode=WATCH_ENABLE|WATCH_NEWSTYLE)
    except:
        sys.exit("No se ha podido inicializar el módulo GPS. Revisa los PINES de la conexión con el módulo GPS.")

    try:
        w3 = Web3(Web3.HTTPProvider(infura_url))
        json_file = open('contracts/Tarifas.json')
        info_json = json.load(json_file)
        abi = info_json['abi']
        contract = w3.eth.contract(address=DIR_CONTRATO_TARIFAS,abi=abi)
    except:
        sys.exit("No se ha podido inicializar el servicio de Infura. Revisa los datos de conexión a la red Blockchain, así como el fichero del SmartContract.")

    try:
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(PIN_STATE_SCOOTER, GPIO.OUT)
    except:
        sys.exit("No se ha podido inicializar el estado del patinete. Revisa el PIN del Rele.")


    # PROGRAMA
    ## Tiempo que pasa entre cada guardado en la BBDD       -> SAVE_DATA segundos
    ## Tiempo que pasa entre cada llamada a la Blockchain   -> CHECK_BLOCKCHAIN * SAVE_DATA segundos

    tiempoRestante = 0
    state = False
    changeStateScooter(state)
    lastLatitud = random.uniform(-90, 90)
    lastLongitud = random.uniform(-180, 180)

    while True:

        # [EVENTUAL] LLAMADA A LA BLOCKCHAIN Y GESTIÓN RELE #################
        if(timeoutBlockchain == 0):

            print("Llamada al SmartContract Tarifas en la Blockchain")
            tiempoRestante = contract.functions.remaining(int(id)).call()
            print("El tiempo restante asociado a este patinete es: " + str(tiempoRestante))

            # Se ha acabado el tiempo del servicio, hasta ahora activo
            if( (tiempoRestante == 0) and (state == True) ):
                print("El patinete ha dejado de tener servicio")
                state = False
                changeStateScooter(state)
            # El patinete está desactivado, pero tampoco ha recibido una nueva petición
            elif( tiempoRestante == 0 ):
                print("El patinete no tiene un servicio contratado")
            # El patinete está desactivado, pero recibe nuevo servicio
            elif( (tiempoRestante != 0) and (state == False) ):
                print("Nuevo servicio contratado: " + str(tiempoRestante))
                state = True
                changeStateScooter(state)
            # El patinete está activado y aun queda tiempo de servicio
            else:
                print("Tiempo restante del servicio: " + str(tiempoRestante))
            
            timeoutBlockchain = CHECK_BLOCKCHAIN

        # OBTENER INFORMACIÓN DEL GPS #################
        #latitud = random.uniform(-90, 90)
        #longitud = random.uniform(-180, 180)
        datosGPS = getPositionData(gpsd)

        if(datosGPS[0] == None or datosGPS[1] == None):
            print("No se han podido obtener datos del GPS")
            latitud = lastLatitud
            longitud = lastLongitud
        else:
            print("Se han podido obtener datos del GPS")
            latitud = datosGPS[0]
            longitud = datosGPS[1]
            lastLatitud = latitud
            lastLongitud = longitud    

        # OBTENER INFORMACIÓN DEL CONTROLADOR #################
        bateria = random.randint(0, 100)
        velocidad = random.randint(0, 50)

        # ENVIAR INFORMACION #################
        now = datetime.datetime.today()
        points = []

        point = {
            "measurement": MEASUREMENT,
            "time": int(now.strftime('%s')),
            "fields": {
                "latitud": float("{:.3f}".format(latitud)),
                "longitud": float("{:.3f}".format(longitud)),
                "bateria": bateria,
                "velocidad": velocidad,
                "idPatinete": id
            }
        }

        print(point)
        points.append(point)

        try:
            # Write points
            client.write_points(points)
        except:
            print("No se ha podido almacenar la información en la BBDD")


        # ACTUALIZAR INFORMACION #################
        timeoutBlockchain = timeoutBlockchain - 1
        time.sleep(SAVE_DATA)


def parse_args():

    """Parse the args."""
    parser = argparse.ArgumentParser(description='example code to play with InfluxDB')
    
    parser.add_argument('--idPatinete', type=str, required=True,
                        help='identification for the eScooter in the system')

    return parser.parse_args()
    

def getPositionData(gpsd):

    try:
        nx = gpsd.next()
        if nx['class'] == 'TPV' :
            latitud = getattr(nx, 'lat', 'Unknown')
            longitud= getattr(nx, 'lon', 'Unknown')
            print("lon = " + str(longitud) + ", lat = " +  str(latitud))
            return [latitud, longitud]
        else:
            return [None, None]
    except:
        print("Error al obtener información del GPS")
        return [None, None]


def changeStateScooter(state):

    try:
        GPIO.output(PIN_STATE_SCOOTER, state)
        time.sleep(1)
    except:
        print("Error al cambiar el estado del patinete")


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
    """