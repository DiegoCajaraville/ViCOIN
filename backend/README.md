# BACKEND

Consiste en la definición e implementación de contratos mediante lenguaje Solidity.

## EJECUCIÓN DEL PROYECTO

Necesitaremos instalar todas las dependencias necesarias para el proyecto y compilar los contratos:

```bash
npm install --save-exact openzeppelin-solidity
# Si usamos alguna librería openzeppelin 
truffle migrate -f 2 --to 2
# Copiar la dirección del contrato 2 (ANEXOS: Obtener la dirección de un contrato) en la linea 59 del contrato /backend/contracts/Tarifas.sol
truffle migrate -f 3 --to 3
# Copiar la dirección del contrato 3 (ANEXOS: Obtener la dirección de un contrato) en la linea 3 del archivo /frontend/js/app.js
# Copiar los archivos json Tarifas.json y Divisa.json en /frontend/contracts
```

## AÑADIR ViCOINs POR CONSOLA

- En construcción ...
<!--```bash
# Ponemos por defecto en la consola la cuenta con la que queremos desplegar los contratos
web3.eth.defaultAccount = ${direccionPropietario}
# Accedemos al primer contrato ObrasDeArte
ODA = await ObrasDeArte.deployed()
# Asignaremos el NFT al nuevo propietario propietario
ODA.safeMint(${direccionPropietario}, ${hashNFT_JSON_IPFS})
# Podremos comprobar que se ha creado si ejecutamos 
ODA.tokenURI(${tokenURI})
ODA.balanceOf(${direccion})
# Transferimos el el NFT con tokenID a la tienda
ODA.safeTransferFrom(${direccionPropietario}, ${direccionTienda}, ${tokenID}, {from: ${direccionPropietario}})
# Comprobamos en el contrato tienda para ver si existe el nuevo NFT
T = await tienda.deployed()
T.totalSales()
T.setPrice(${tokenId}, web3.utils.toBN("${priceNFT}"), {from: ${direccionPropietario}})
``` -->

## ANEXOS

### Truffle

Usaremos un framework llamado Truffle que nos permite crear proyectos, ejecutarlos, compilarlos, ejecutarlos... Se instalará como una dependencia de NodeJS: `npm install truffle -g `

Una vez instalado Truffle, se crea un proyecto mediante `truffle init backend` o bien `truffle init` si nos encontramos ya en el directorio.

Dentro del proyecto se ha generado una estructura definida por:
- /contracts: contiene el código fuente (contratos) de nuestras aplicaciones descentralizadas.
- /migrations: contiene código para desplegar los contratos sobre la red descentralizada.
- /test: permite definir baterías de preguntas mediante lenguaje Solidity o JavaScript.
- truffle-config.js: conectar nuestros contratos a la BlockChain.

Para desplegar el contrato usaremos `truffle deploy` pero si queremos obtener el código compilado de los contratos en formato JSON usaremos `truffle compile` (otra opción es `truffle migrate -f 2 --to 2` donde los flags -f y --to indican el primer y último contrato a compilar).

### Ganache

Nos permitirá despligar una Blockchain local, que cuenta con múltiples cuentas (claves públicas), orientado al testing del proyecto. En nuestro caso, usaremos la interfaz gráfica pues será más sencillo de visualizar:

```bash
https://www.trufflesuite.com/ganache
```

Para interconectar el entorno Truffle con el emulador blockchain Ganache debemos editar en el fichero truffle-config.js de nuestro proyecto el siguiente párrafo:
```bash networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    }
}
```

### Obtener la dirección de un contrato

Una vez desplegado un contrato en la blockchain, se podrá acceder a su dirección pública mediante la consola de Truffle (`truffle console`). Para obtener la dirección se llamará a la propiedad `address` del contrato: `${nombreContrato}.address`.
