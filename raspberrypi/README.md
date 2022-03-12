# RASPBERRY PI

#### getTimePatinete.py
~~~
Se debe instalar el paquete de web3:
`pip install web3`
Se ocupa de llamar al método remaining({patinete}) del contrato tarifas siendo {patinete} el número de patinete a consultar. Se le debe pasar este parámetro por línea de comandos:
`python3 getTimePatinete.py 0`
Devolverá el tiempo que le queda de uso al patinete0 en segundos.
Debemos tener en cuenta que solo hay 3 patinetes (0, 1 y 2).
~~~