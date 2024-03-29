from web3 import Web3
import json,sys

DIR_CONTRATO_TARIFAS = '0xFe5d6C0D7b500f0F801d18E16f85E1EFBc275Ffa'
URI_INFURA = '7cf06df7347d4670a96d76dc4e3e3410'

#INFURA HTTP API
infura_url = 'https://ropsten.infura.io/v3/' + URI_INFURA  # your uri
w3 = Web3(Web3.HTTPProvider(infura_url))

with open('contracts/Tarifas.json') as json_file:
    info_json = json.load(json_file)
    abi = info_json['abi']
    contract = w3.eth.contract(address=DIR_CONTRATO_TARIFAS,abi=abi)
    tiemporestante = contract.functions.remaining(int(sys.argv[1])).call()
    print(tiemporestante)

