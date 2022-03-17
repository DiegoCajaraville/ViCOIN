from gps import *
import time

running= True

def getPositionData(gps):
    nx = gpsd.next()
    if nx['class'] == 'TPV' :
        latitud = getattr(nx, 'lat', 'Unknown')
        longitud= getattr(nx, 'lon', 'Unknown')
        print("Tu posicion: lon = " + str(longitud) + ", lat = " +  str(latitud))
        
gpsd = gps(mode=WATCH_ENABLE|WATCH_NEWSTYLE)

try:
    print("Application Started (pulsa ctrl + c para parar)")
    while running:
        getPositionData(gpsd)
        time.sleep(1.0)
        
except KeyboardInterrupt:
    running = False
    print("Application Closed")