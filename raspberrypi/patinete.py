import argparse
import datetime
import time
import random

from influxdb import InfluxDBClient

# VARIABLES GLOBALES
HOST = 'ec2-44-201-180-246.compute-1.amazonaws.com'
PORT = 8086
USER = 'admin'
PASSWORD = 'lproPassword'
DBNAME = 'patinetes'

SAVE_DATA = 5
CHECK_BLOCKCHAIN = 6


def main(id):

    measurement = "patinete" + id
    timeoutBlockchain = 0

    try:
        client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME)
        client.switch_database(DBNAME)
    except:
        print("No se ha podido conectar con la BBDD")

    # PROGRAMA
    ## Tiempo que pasa entre cada guardado en la BBDD       -> SAVE_DATA segundos
    ## Tiempo que pasa entre cada llamada a la Blockchain   -> CHECK_BLOCKCHAIN * SAVE_DATA segundos

    tiempoRestante = 50
    activo = True

    while True:

        # [EVENTUAL] LLAMADA A LA BLOCKCHAIN Y GESTIÓN RELE #################
        if(timeoutBlockchain == 0):

            print("Llamada a la blockchain")
            tiempoRestante = random.randint(0, 2)

            # Se ha acabado el tiempo del servicio, hasta ahora activo
            if( (tiempoRestante == 0) and (activo == True) ):
                print("El patinete ha dejado de tener servicio")
                activo = False
            # El patinete está desactivado, pero tampoco ha recibido una nueva petición
            elif( tiempoRestante == 0 ):
                print("El patinete no tiene un servicio contratado")
            # El patinete está desactivado, pero recibe nuevo servicio
            elif( (tiempoRestante != 0) and (activo == False) ):
                print("Nuevo servicio contratado: " + str(tiempoRestante))
                activo = True
            # El patinete está activado y aun queda tiempo de servicio
            else:
                print("Tiempo restante del servicio: " + str(tiempoRestante))
            
            timeoutBlockchain = CHECK_BLOCKCHAIN

        # OBTENER INFORMACIÓN DEL GPS #################
        
        latitud = random.uniform(-90, 90)
        longitud = random.uniform(-180, 180)
        bateria = random.randint(0, 100)
        velocidad = random.randint(0, 50)

        # ENVIAR INFORMACION #################
        now = datetime.datetime.today()
        points = []

        point = {
            "measurement": measurement,
            "time": int(now.strftime('%s')),
            "fields": {
                "latitud": float("{:.3f}".format(latitud)),
                "longitud": float("{:.3f}".format(longitud)),
                "bateria": bateria,
                "velocidad": velocidad
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

    print("Latitud: {0:.3f}".format(latitud))
    print("Longitud: {0:.3f}".format(longitud))
    print("Bateria: " + str(bateria))
    print("Velocidad: " + str(velocidad) + "\n")
    """