# RASPBERRY PI


#PARA LA CONFIGURACIÓN INICIAL
#En primer lugar debemos de tener en las "interfacing options" Would you like a login shell to be accessible over serial?-> NO y "Would you like the serial porthardware to be eneabled?”-> YES
sudo raspi-config

sudo apt-get update
sudo apt-get dist-upgrade
sudo rpi-update

#reiniciar


# editar el fichero config.txt:

sudo nano /boot/config.txt
#añadir al final 

dtoverlay=pps-gpio,gpiopin=18

# editar el fichero /etc/modules:

sudo nano /etc/modules

#añadir 
pps-gpio

#reiniciar
#modificar la carpeta:

sudo nano /etc/default/gpsd

#esa carpeta debe de quedar:

START_DAEMON=»true»
GPSD_OPTIONS=»-n»
DEVICES=»/dev/ttyAMA0″
USBAUTO=»true»
GPSD_SOCKET=»/var/run/gpsd.sock»


#reiniciar

#ejecutamos el gps

sudo gpsd /dev/ttyAMA0 -F /var/run/gpsd-sock

#para ver que se envía info al puerto

sudo cat /dev/ttyAMA0s

#para comprobar que llegan a la aplicación de GPS

cgps -s

