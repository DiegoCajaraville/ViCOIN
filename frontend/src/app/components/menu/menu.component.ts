import { Component, OnInit } from '@angular/core';


import contratoViCOIN from '../../../../contracts/goerli/ViCOIN.json';
import contratoViCOINSale from '../../../../contracts/goerli/ViCOINSale.json';
import contratoTarifas from '../../../../contracts/goerli/Tarifas.json';



declare let window:any;
declare let TruffleContract:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  account;
  ViCOIN;
  ViCOINSale;
  Tarifas;
  metamaskProvider;
  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;
  monedaCliente;
  constructor() { }

  async ngOnInit() {
    this.loadMetamask();
    this.loadContract();
  }
  clickMenuMoneda(){
    window.location.href="http://localhost:8100/comprarMoneda";
  }


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

        this.ViCOINSaleContract = await this.ViCOINSale.deployed();
        this.TarifasContract = await this.Tarifas.deployed();
        this.ViCOINContract= await this.ViCOIN.at('0x30FeD49F1808F83a2d1b4cf26C275DE66E4eE950');
        var a= await this.ViCOINContract.balanceOf(this.account);
        this.monedaCliente=a/Math.pow(10,18);
    }catch (error) {
        console.error(error);
    }
  }
}
