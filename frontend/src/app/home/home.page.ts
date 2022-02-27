import { Component } from '@angular/core';


//const TruffleContract = require("truffle-contract");

import * as contratoViCOIN from '../../../contracts/ViCOIN.json';
import * as contratoViCOINSale from '../../../contracts/ViCOINSale.json';
import * as contratoTarifas from '../../../contracts/Tarifas.json';


declare let window:any;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //Cuenta seleccionada por el usuario
  account;
  contracts;
  metamaskProvider;

  ViCOINContract;
  ViCOINSalesContract;
  TarifasContract;

  constructor() {}
  ngOnInit() {
    this.loadMetamask();
    this.loadContract();
  }

  /**
     * Carga el objeto del navegador que contiene la extensión del wallet 
     * que contiene las cuentas para la red BlockChain
    */

  
  async loadMetamask(){
    if (window.ethereum) {
        this.metamaskProvider=window.ethereum;
        const accounts=await this.metamaskProvider.request({ method: "eth_requestAccounts" });
        this.account=accounts[0];

        console.log(this.account);
    }else 
        alert("No ethereum browser is installed. Try it installing MetaMask ");
  }

  async loadContract(){
    try{
      // Obtenemos los contratos compilados desde local
      //const tiendaFile = await fetch("tienda.json");
      //const tiendaContractJSON = await tiendaFile.json();
      // Creamos la estructura del contrato
      
      //this.contracts.ViCOIN = TruffleContract(contratoViCOIN);
      //this.contracts.ViCOINSale = TruffleContract(contratoViCOINSale);
      //this.contracts.Tarifas = TruffleContract(contratoTarifas);
    //
//
      ////// Nos conectamos al contrato a través de la cuenta del wallet (Metamask)
      //this.contracts.ViCOIN.setProvider(this.metamaskProvider);
      //this.contracts.ViCOINSale.setProvider(this.metamaskProvider);
      //this.contracts.Tarifas.setProvider(this.metamaskProvider);
//
      //this.ViCOINContract= await this.contracts.ViCOIN.deployed();
      //this.ViCOINSalesContract=await this.contracts.ViCOINSale.deployed();
      //this.TarifasContract = await this.contracts.Tarifas.deployed();
      //console.log("Contratos cargados");
      //console.log(this.ViCOINContract);
      //console.log(this.ViCOINSalesContract);
      //console.log(this.TarifasContract);
      
      //const patinetes = await this.TarifasContract.Patinetes(0);
      //const tokenIdNFT = patinetes.IdPatinete.toNumber();

      //const priceNFT   = patinetes.price/(Math.pow(10, 18));   // Para pasar de Weis a ETH
      //var priceNFT_WEI = priceNFT_ETH * (Math.pow(10, 18));

      //value nen wei
      //await App.tiendaContract.buyNFT(tokenId, {
      //  from: this.account,
      //  value: priceNFT_WEI
      //});

      //console.log(tokenIdNFT);

    }catch (error) {
      console.error(error);
    }
  }
  
  
 
}



