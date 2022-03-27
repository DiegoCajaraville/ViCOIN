import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ComprarMonedaService } from './comprar-moneda.service';

import contratoViCOIN from '../../../contracts/ropsten/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ropsten/ViCOINSale.json';
import contratoTarifas from '../../../contracts/ropsten/Tarifas.json';


declare let window:any;
declare let TruffleContract:any;



@Component({
  selector: 'app-comprar-moneda',
  templateUrl: './comprar-moneda.page.html',
  styleUrls: ['./comprar-moneda.page.scss'],
})
export class ComprarMonedaPage implements OnInit {
  precio=0.01;
  

  dineroCliente;

  disponibleAdmin;
  

  account;
  ViCOIN;
  ViCOINSale;
  Tarifas;
  metamaskProvider;
  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;
  a;

  constructor(private ComprarMonedaService: ComprarMonedaService) { }
  
  ngOnInit() {
    this.loadMetamask();
    this.loadContract();
  }

  async comprarMoneda(precioSeleccionado){
    //El precio del vic fijo?
    
    var address = this.ViCOINSaleContract.address; 
    
    console.log(address);
    this.disponibleAdmin = await this.ViCOINContract.balanceOf(address);
    console.log(this.disponibleAdmin.toString());
    console.log(precioSeleccionado);
    if( (this.disponibleAdmin-precioSeleccionado*Math.pow(10,18)) >0 ){
      //Se puede comprar
      
      var b=this.precio*precioSeleccionado*Math.pow(10,18);   
      var c=(precioSeleccionado*Math.pow(10,18));
      this.ViCOINSaleContract.buyViCOINS(c.toString(),{from: this.account,value: b.toString()}).once(
        alert("Realizando compra")
      );
      alert("Compra realizada");

    }
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
        
        const beta= this.ViCOINContract.address;
        var alfa= await this.ViCOINContract.balanceOf(beta);
        this.a = await this.ViCOINContract.balanceOf(this.account);
        this.dineroCliente = this.a/Math.pow(10,18);
        console.log(this.dineroCliente);
    } catch (error) {
        console.error(error);
    }
  }
}
