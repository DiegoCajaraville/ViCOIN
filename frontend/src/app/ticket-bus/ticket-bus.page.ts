import { Component, OnInit } from '@angular/core';
var QRCode = require('qrcode')

const direccionAdministrador = '0x76A431B17560D46dE8430435001cBC66ae04De46'

import contratoViCOIN from '../../../contracts/goerli/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/goerli/ViCOINSale.json';
import contratoTarifas from '../../../contracts/goerli/Tarifas.json';
import { timer } from 'rxjs';

declare let window:any;
declare let TruffleContract:any;


@Component({
  selector: 'app-ticket-bus',
  templateUrl: './ticket-bus.page.html',
  styleUrls: ['./ticket-bus.page.scss'],
})
export class TicketBusPage implements OnInit {
  account;
  ViCOIN;
  ViCOINSale;
  Tarifas;
  metamaskProvider;
  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;



  constructor() { }

  ngOnInit() {
    this.loadMetamask();
    this.loadContract(); 
  }

  async payment(){

    // ViC que cuesta el pago a realizar
    var pagoDinero = 1
    var pagoWEIs = pagoDinero * Math.pow(10,18);
        
    await this.ViCOINContract.transfer(direccionAdministrador, BigInt(pagoWEIs), {
        from: this.account,
    })
    .once("transactionHash", async function (hash) {

        console.log("Se ha hecho la transaccion \n" + hash)

        await new Promise((resolve) => setTimeout(resolve, 30000));
        
        const transaction = await this.metamaskProvider.request({
          method: "eth_getTransactionByHash",
          params: [hash],
        });

        console.log("alert dentro del callback: \n" + transaction);

        this.createQR(transaction)
    });
  }


  async loadMetamask(){
    if (window.ethereum) {
        this.metamaskProvider=window.ethereum;
        const accounts= await this.metamaskProvider.request({ method: "eth_requestAccounts" });
        this.account=accounts[0];
        console.log(this.account);
    }else 
        alert("No ethereum browser is installed. Try it installing MetaMask ");
    }

  async loadContract(){
    try{
        //Creamos la estructura del contrato
        this.ViCOIN=TruffleContract(contratoViCOIN);
        this.ViCOINSale = TruffleContract(contratoViCOINSale);
        this.Tarifas = TruffleContract(contratoTarifas);
        
        // Nos conectamos al contrato a través de la cuenta del wallet (Metamask)
        this.ViCOIN.setProvider(this.metamaskProvider);
        this.ViCOINSale.setProvider(this.metamaskProvider);
        this.Tarifas.setProvider(this.metamaskProvider);

        this.ViCOINSaleContract = await this.ViCOINSale.deployed();
        this.TarifasContract =await  this.Tarifas.deployed();
        this.ViCOINContract= await this.ViCOIN.at('0x30FeD49F1808F83a2d1b4cf26C275DE66E4eE950');
        
    } catch (error) {
        console.error(error);
    }
  }

  createQR( transaction ){
    
    //transaction = {
    //    "v": "0x00",  //ECDSA recovery id
    //    "r": "0x2d286db94de30973ece8f67e3a67a39d31ffad51eedcd64c0eef7eb9754b73b9", //ECDSA signature r
    //    "s": "0x439ecc3888f29170426c442405319e22a13a962b6719c7e9236399d16eeebe3a", //ECDSA signature s
    //    "to": "0xc15648cfe1afc36eddabc5a79c5f33480bf24ce0", //address
    //    "gas": "0x112cb", //The gas limit provided by the sender in Wei
    //    "from": "0x76a431b17560d46de8430435001cbc66ae04de46", //The sender of the transaction
    //    "hash": "0xf64f9c436e89bae552d4fcbdd5f93d5950a2b5051a21b6eb3df065bcfa895f28", //Keccak 256 Hash of the RLP encoding of a transaction
    //    "nonce": "0x32", //The total number of prior transactions made by the sender
    //    "input": "0xf7d97577000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000038d7ea4c68000", //The data field sent with the transaction
    //    "value": "0x0", //Value of Ether being transferred in Wei
    //    "gasPrice": "0x9502f90e", //The gas price willing to be paid by the sender in Wei
    //    "maxFeePerGas": "0x9502f90e",
    //    "maxPriorityFeePerGas": "0x9502F900",
    //    "type": "0x2"
    //}

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
}
