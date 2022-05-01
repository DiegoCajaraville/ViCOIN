import { Component, OnInit } from '@angular/core';

import { ContractsService } from '../services/contracts.service';
var QRCode = require('qrcode')

const direccionAdministrador = '0x76A431B17560D46dE8430435001cBC66ae04De46'

@Component({
  selector: 'app-ticket-bus',
  templateUrl: './ticket-bus.page.html',
  styleUrls: ['./ticket-bus.page.scss'],
})
export class TicketBusPage implements OnInit {
    tarifa


    constructor(private contractsService: ContractsService) { }

    async ngOnInit() {
        this.contractsService.loadMetamask();
        await this.contractsService.loadContract(); 
        //this.createQRHash("0x86870d8cb62d511df79ecd4ac2ab845cb035c13df28c3e0f4d3f66a9319c0618")
    }

    async payment(){

        // ViC que cuesta el pago a realizar
        var pagoDinero
        if(this.tarifa==1){
            pagoDinero=1;
        }

        if(this.tarifa==2){
            pagoDinero=2;
        }
        if(this.tarifa==3){
            pagoDinero=3;
        }
        
        var pagoWEIs = pagoDinero * Math.pow(10,18);
        var hashTransaction = []
            
        await this.contractsService.ViCOINContract.transfer(direccionAdministrador, BigInt(pagoWEIs), {
            from: this.contractsService.account,
        })
        .once("transactionHash", async function (hash) {

            console.log("Se ha hecho la transaccion \n" + hash)
            hashTransaction[0] = hash
            
            try {
                //var transaction = await this.metamaskProvider.request({
                //    method: "eth_getTransactionByHash",
                //    params: [hash],
                //});

                hash = hash.replace(/0x/g, '')

                console.log("[INFO] La transaccion enviada será: " + hash)

                QRCode.toCanvas(document.getElementById('qrcode'), hash, {
                    width: window.innerWidth * 0.9,
                    height: window.innerWidth * 0.9,
                    color: {
                        //dark:"#5868bf",
                        light:"#E0ECFF"
                    },
                    errorCorrectionLevel : 'L'
                }, function (error) {
                    if (error) 
                        console.error(error)
                    console.log('success!');
                });

            } catch (error) {
                console.error(error)
            }
        });

        /*
        curl http://sample-endpoint-name.network.quiknode.pro/token-goes-here/ \
        -X POST \
        -H "Content-Type: application/json" \
        --data '{"method":"eth_getTransactionByHash","params":["0x04b713fdbbf14d4712df5ccc7bb3dfb102ac28b99872506a363c0dcc0ce4343c"],"id":1,"jsonrpc":"2.0"}'
        */
        /*
        console.log("Comprobamos la transaccion fuera del once")

        var headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        var payload = '{"method":"eth_getTransactionByHash","params":["' + hashTransaction[0] + '"],"id":5,"jsonrpc":"2.0"}'
        console.log(JSON.parse(payload))
        this.http.post("https://goerli.infura.io/v3/7cf06df7347d4670a96d76dc4e3e3410", payload, {
            headers
        }).subscribe({
            next: data => {
                console.log("Ha salido bien: ", data)
            },
            error: error => {
                console.error('Ha ocurrido un error: ', error);
            }
        })
        */

    }

   


    /*
    async createQRTransaction( transaction ){
        
        transaction = {
            "v": "0x00",  //ECDSA recovery id
            "r": "0x2d286db94de30973ece8f67e3a67a39d31ffad51eedcd64c0eef7eb9754b73b9", //ECDSA signature r
            "s": "0x439ecc3888f29170426c442405319e22a13a962b6719c7e9236399d16eeebe3a", //ECDSA signature s
            "to": "0xc15648cfe1afc36eddabc5a79c5f33480bf24ce0", //address
            "gas": "0x112cb", //The gas limit provided by the sender in Wei
            "from": "0x76a431b17560d46de8430435001cbc66ae04de46", //The sender of the transaction
            "hash": "0xf64f9c436e89bae552d4fcbdd5f93d5950a2b5051a21b6eb3df065bcfa895f28", //Keccak 256 Hash of the RLP encoding of a transaction
            "nonce": "0x32", //The total number of prior transactions made by the sender
            "input": "0xf7d97577000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000038d7ea4c68000", //The data field sent with the transaction
            "value": "0x0", //Value of Ether being transferred in Wei
            "gasPrice": "0x9502f90e", //The gas price willing to be paid by the sender in Wei
            "maxFeePerGas": "0x9502f90e",
            "maxPriorityFeePerGas": "0x9502F900",
            "type": "0x2"
        }

        // Eliminamos el campo "to" de la transaccion
        delete transaction.to;
        delete transaction.type;
        delete transaction.value;
        delete transaction.nonce;

        // Adaptamos el formato de la transaccion y creamos el QR
        transaction = JSON.stringify(transaction)

        transaction = transaction.replace(/":"0x/g, '#')
                                .replace(/","/g, '&')
                                .replace(/{"/g, '(')
                                .replace(/"}/g, ')')
                                .replace(/0000000000/g, '%0')
                                .replace(/00000/g, '%5')
                                .replace(/gasPrice/g, '@$')
                                .replace(/maxFeePerGas/g, '@F')
                                .replace(/maxPriorityFeePerGas/g, '@P')
                                .replace(/gas/g, '@g')
                                .replace(/from/g, '@f')
                                .replace(/hash/g, '@h')
                                .replace(/input/g, '@i')

        console.log("[INFO] La transaccion enviada será: " + transaction)

        QRCode.toCanvas(document.getElementById('qrcode'), transaction, {
            width: window.innerWidth * 0.9,
            height: window.innerWidth * 0.9,
            color: {
                //dark:"#5868bf",
                light:"#E0ECFF"
            },
            errorCorrectionLevel : 'L'
        }, function (error) {
            if (error) 
                console.error(error)
            console.log('success!');
        });

    }
    */

    createQRHash( hash ){

        hash = hash.replace(/0x/g, '')

        console.log("[INFO] La transaccion enviada será: " + hash)

        QRCode.toCanvas(document.getElementById('qrcode'), hash, {
            width: window.innerWidth * 0.9,
            height: window.innerWidth * 0.9,
            color: {
                //dark:"#5868bf",
                light:"#E0ECFF"
            },
            errorCorrectionLevel : 'L'
        }, function (error) {
            if (error) 
                console.error(error)
            console.log('success!');
        });

    }
    
}
