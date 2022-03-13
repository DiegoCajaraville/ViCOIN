gpsd = gps(mode=WATCH_ENABLE)
while gpsp.running:
    gpsd.next()