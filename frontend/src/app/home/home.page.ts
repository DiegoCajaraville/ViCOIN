import { Component } from '@angular/core';

import contratoViCOIN from '../../../contracts/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ViCOINSale.json';
import contratoTarifas from '../../../contracts/Tarifas.json';

declare let window:any;
declare let TruffleContract:any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

    //Cuenta seleccionada por el usuario
    account;
    ViCOIN;
    ViCOINSale;
    Tarifas;
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

            //Creamos la estructura del contrato
            this.ViCOIN=TruffleContract(contratoViCOIN);
            this.ViCOINSale = TruffleContract(contratoViCOINSale);
            this.Tarifas = TruffleContract(contratoTarifas);
            
            // Nos conectamos al contrato a través de la cuenta del wallet (Metamask)
            this.ViCOIN.setProvider(this.metamaskProvider);
            this.ViCOINSale.setProvider(this.metamaskProvider);
            this.Tarifas.setProvider(this.metamaskProvider);

            this.ViCOINContract= await this.ViCOIN.deployed();
            
            this.ViCOINSalesContract=await this.ViCOINSale.deployed();
            this.TarifasContract = await this.Tarifas.deployed();


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
        } catch (error) {
            console.error(error);
        }
    }
    
}