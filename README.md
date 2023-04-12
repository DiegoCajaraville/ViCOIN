# ViCOIN

ViCOIN es un sistema descentralizado para la gestión de servicios ofrecidos por una administración sin necesidad de intermediarios financieros. Estos servicios, desplegados sobre una red blockchain, son accesibles a los usuarios haciendo uso de una divisa monetaria propia (ViC).

En este proyecto se ha implementado ViCOIN orientándolo al alquiler de patinetes por parte del ayuntamiento. El proyecto está organizado en cuatro subcarpetas:

## Backend

En la subcarpeta `backend` se encuentra todo lo relacionado con la parte de blockchain que es la que lleva la contabilidad y finanzas de forma descentralizada. En esta sección se han desarrollado los contratos inteligentes que permiten la gestión de los pagos y la generación de tokens ViC.

## Android_app

En la subcarpeta `Android_app` se encuentra nuestra implementación del estándar de criptowallet de código abierto Alphawallet que está orientada a los usuarios del sistema para que puedan realizar los pagos de una forma cómoda y segura.

## Frontend

En la subcarpeta `frontend` se encuentra todo lo relacionado con el front-end de una página web que será la que accederán los usuarios a través de la billetera para comprar ViCs o realizar pagos de alquiler de patinetes, entre otras cosas. 

## Raspberry Pi

En la subcarpeta `raspberry_pi` se encuentra todo lo relacionado con la programación de una Raspberry Pi que va conectada al patinete y consulta a la blockchain para ver si ha recibido pagos. En caso de haberlos recibido, permite su uso durante el tiempo contratado. Una vez terminado el tiempo, la Raspberry Pi apaga el patinete para que no se pueda seguir usando.

El objetivo principal de ViCOIN es ofrecer un sistema de pagos seguros, transparentes y descentralizados para la gestión de servicios ofrecidos por una administración. 

¡Gracias por interesarte en ViCOIN! Si tienes alguna duda o sugerencia, no dudes en contactarnos.
