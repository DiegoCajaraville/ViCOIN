from web3 import Web3
import json,sys

DIR_CONTRATO_TARIFAS = '0x9c289B7EF6B4b25E927810B8f4EccBE61e6F400e'
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

