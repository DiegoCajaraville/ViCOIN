
led1=21
import RPi.GPIO as GPIO
import time
#output en pin 21

GPIO.setmode(GPIO.BCM)

GPIO.setup(led1, GPIO.OUT)

while True:
    GPIO.output(led1, True) 
    time.sleep(1)
    GPIO.output(led1, False)
    time.sleep(1)