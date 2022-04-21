import argparse
import datetime
import time
import random
import cv2
import requests
import json

from influxdb import InfluxDBClient
#from gps import *
from web3 import Web3
import RPi.GPIO as GPIO

# VARIABLES GLOBALES
HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
PORT = 8086
USER = 'admin'
PASSWORD = 'lproPassword'
DBNAME = 'ViCOIN'
MEASUREMENT = 'transporte'
TRANSPORTE = "BUS"

URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'  # your uri
CHAIN_ID = '5' # (Ropsten = 3, Rinkeby = 4, Goerli = 5)
DIRECCION_VICOIN = '0x30FeD49F1808F83a2d1b4cf26C275DE66E4eE950'
CUENTA_ADMINISTRADOR = '0x76A431B17560D46dE8430435001cBC66ae04De46'

PIN_TIMBRE = 23

###########################################################################################

def main():

    # INICIALIZACION 

    if( CHAIN_ID == '3'):
        infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA
        rutaTarifas = 'contracts/ropsten/ViCOIN.json'
    elif( CHAIN_ID == '4'):
        infura_url = 'https://rinkeby.infura.io/v3/' + URI_INFURA
        rutaTarifas = 'contracts/rinkeby/ViCOIN.json'
    elif( CHAIN_ID == '5'):
        infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA
        rutaTarifas = 'contracts/goerli/ViCOIN.json'
    else:
        infura_url = 'https://goerli.infura.io/v3/' + URI_INFURA
        rutaTarifas = 'contracts/goerli/ViCOIN.json'

    try:
        print("[INFO] Inicializando datos BBDD")
        client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME)
        client.switch_database(DBNAME)
    except:
        sys.exit("[ERROR] No se ha podido conectar con la BBDD. Revisa si los datos de conexión han cambiado o si el servicio AWS está activo.")

    try:
        print("[INFO] Inicializando pines de conexión")
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(PIN_TIMBRE, GPIO.OUT)
        
        GPIO.output(PIN_TIMBRE, False)
    except:
        sys.exit("[ERROR] No se ha podido inicializar los pines de conexión de la Raspberry Pi. Revisa los pines del zumbador.")

    try:
        print("[INFO] Inicializando conexión Blockchain")
        w3 = Web3(Web3.HTTPProvider(infura_url))
        json_file = open(rutaTarifas)
        info_json = json.load(json_file) 
        abi = info_json['abi']
        contract = w3.eth.contract(address=DIRECCION_VICOIN,abi=abi)
    except:
        sys.exit("[ERROR] No se ha podido inicializar el servicio de Infura. Revisa los datos de conexión a la red Blockchain, así como el fichero del SmartContract.")

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
    
        # if there is a bounding box, draw one, along with the data
        if(bbox is not None and data):

            hash = "0x" + data
            print("[SUCCESS] Información del QR: ", hash)

            if( len(hash) != 66 ):
                print("[ERROR] La información contenida en el QR no corresponde con un hash")
                activateSound(0.15, 3)
            else:
            
                #VALIDACION DE LA TRANSACCION
                print("[INFO] Procedemos a comprobar si el estado de la transacción es correcto")
                result = comprobarTransaccion(hash, infura_url, client, contract)
                
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

    try:
        response = requests.post(url, data = transaction, headers = {"Content-Type": "application/json"})
        status = response.status_code
        transaction = response.text

        print("Status code: " + str(status))
        print("Response: " + str(transaction))

        return status, transaction

    except:
        return 500, ""



def comprobarTransaccion(hash, url, clienteBBDD, contract):

    status, data = getTransactionByHash(hash, url)

    # 1 - Comprobamos que haya devuelto una respuesta esperada
    if( status < 200 or status >= 300 ):
        print("[ERROR] Infura no ha devuelto una respuesta esperada.")
        return False

    # 2 - Comprobamos que se ha encontrado una transaccion con dicho Hash
    data = json.loads(data)
    transaction = data["result"]

    ## {"jsonrpc":"2.0","id":5,"result":{"accessList":[],"blockHash":"0x17c947d946185de5c63ab43c6e289c2533e8b4284b14674f448b8d31fe772a41","blockNumber":"0x65de8c","chainId":"0x5","from":"0x0570b5fc3a5a31e157b419992fb104f4cd18bc7f","gas":"0xac0e","gasPrice":"0x9502f907","hash":"0x86870d8cb62d511df79ecd4ac2ab845cb035c13df28c3e0f4d3f66a9319c0618","input":"0xa9059cbb00000000000000000000000076a431b17560d46de8430435001cbc66ae04de460000000000000000000000000000000000000000000000000de0b6b3a7640000","maxFeePerGas":"0x9502f90e","maxPriorityFeePerGas":"0x9502f900","nonce":"0x25","r":"0x956d9b7e629be63f6309b611b4fe739887e2182f6b194f518c0fae22dfaa1f06","s":"0x99c8d323b31cd554b6af0f83ac4b8054b7ec50d611c98ea5c8d6451adb861a2","to":"0x30fed49f1808f83a2d1b4cf26c275de66e4ee950","transactionIndex":"0x6","type":"0x2","v":"0x1","value":"0x0"}}

    if( transaction == None ):
        print("[ERROR] No se ha encontrado una transacción con dicho hash.")
        return False

    # 3 - Comprobamos que no se haya registrado una transacción anterior con el mismo hash
    resultBBDD = checkHashBBDD(clienteBBDD, hash)

    if( not resultBBDD ):
        print("[ERROR] Existe una transacción previa en el registro ya usada")
        return False

    # 4 - Extraemos los datos de la transaccion y comprobamos que sea correcta

    dataInput = transaction['input']
    resultDecode = contract.decode_function_input( dataInput )
    ##(<Function transfer(address,uint256)>, {'to': '0x76A431B17560D46dE8430435001cBC66ae04De46', 'amount': 1000000000000000000})

    funcionTransaction = str(resultDecode).split('<')[1].split('>')[0]
    cuerpoFuncion = '{' + str( str(resultDecode).split('{')[1].split('}')[0] ) + '}'
    cuerpoFuncion = json.loads( cuerpoFuncion.replace('\'', '"'))

    if( funcionTransaction != "Function transfer(address,uint256)" or
        cuerpoFuncion['to'].lower() != CUENTA_ADMINISTRADOR.lower() or 
        cuerpoFuncion['amount'] < 1000000000000000000 or
        transaction['to'].lower() != DIRECCION_VICOIN.lower() ):

        print("[ERROR] La transaccion existe pero no cumple con los requisitos")
        return False  

    #gas = int( transaccion["gas"], 16) # Hexadecimal to decimal
    #print(gas)

    sendInformationBBDD(clienteBBDD, hash, TRANSPORTE)
    return True

###########################################################################################

def checkHashBBDD(client, hash):

    query = 'SELECT * FROM ' + str(MEASUREMENT) + ' WHERE hash=\'' + str(hash) + '\' ORDER BY time DESC LIMIT 1'
    print("Querying data: " + str(query))

    try:
        # Obtener informacion de la BBDD
        result = client.query(query, database=DBNAME)

        listaHash = list(result.get_points(measurement=MEASUREMENT))

        if( len(listaHash) != 0 ):
            print("[INFO] Hash: {0}".format(listaHash[0]['hash']))
            print("[INFO] Transporte: {0}".format(listaHash[0]['transporte']))
            return False
        else:
            return True 

    except:
        print("[ERROR] No se ha podido obtener información de la BBDD")
        return False


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

###########################################################################################

if __name__ == '__main__':
    main()