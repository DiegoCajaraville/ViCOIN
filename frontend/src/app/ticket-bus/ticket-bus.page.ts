import { Component, OnInit } from '@angular/core';


import contratoViCOIN from '../../../contracts/ropsten/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ropsten/ViCOINSale.json';
import contratoTarifas from '../../../contracts/ropsten/Tarifas.json';

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
  payment(){
    console.log("cvnmsdfiojvnjikodfnv");
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
        this.ViCOINContract= await this.ViCOIN.at('0x24B09781e928b16afE34b7C35F4481565d421F7A');
        
    } catch (error) {
        console.error(error);
    }
  }
}
