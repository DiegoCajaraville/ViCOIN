import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ComprarMonedaService } from './comprar-moneda.service';

import contratoViCOIN from '../../../contracts/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ViCOINSale.json';
import contratoTarifas from '../../../contracts/Tarifas.json';


declare let window:any;
declare let TruffleContract:any;



@Component({
  selector: 'app-comprar-moneda',
  templateUrl: './comprar-moneda.page.html',
  styleUrls: ['./comprar-moneda.page.scss'],
})
export class ComprarMonedaPage implements OnInit {
  precio=0.01;
  precioSeleccionado=1;
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

  async comprarMoneda(){
    //El precio del vic fijo?
    var address = this.ViCOINSaleContract.address;
    this.disponibleAdmin = await this.ViCOINContract.balanceOf(address);
    if( (this.disponibleAdmin-(this.precioSeleccionado*Math.pow(10,18))) >0 ){
      //Se puede comprar
      var b=this.precio*this.precioSeleccionado*Math.pow(10,18);   
      var c=(this.precioSeleccionado*Math.pow(10,18));
      await this.ViCOINSaleContract.buyViCOINS(c.toString(),{from: this.account,value: b.toString()});
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
        this.ViCOINContract= await this.ViCOIN.at('0xF4Acd5dFD9b3b9fbDA1FEd81aaBA6AF5a9F6A26A');
        //const beta= await this.ViCOINSaleContract.tokenPrice();
        const beta= this.ViCOINContract.address;
        var alfa= await this.ViCOINContract.balanceOf(beta);
        console.log(alfa);
        //this.dineroCuenta=await this.ViCOINContract.balanceOf(this.account);
        //this.ViCOINContract.address;
        //console.log("Contratos cargados");
        //console.log(this.ViCOINContract.balanceOf(this.account));
        //console.log(this.ViCOINSalesContract);
        //console.log(this.TarifasContract);
        this.a = await this.ViCOINContract.balanceOf(this.account);
        this.dineroCliente = this.a.toNumber();
        
        //const patinetes = await this.TarifasContract.Patinetes(0);
        //const tokenIdNFT = patinetes.IdPatinete.toNumber();

        //const priceNFT   = patinetes.price/(Math.pow(10, 18));   // Para pasar de Weis a ETH
        //var priceNFT_WEI = priceNFT_ETH * (Math.pow(10, 18));

        //value nen wei
        //await App.tiendaContract.buyNFT(tokenId, {
        //  from: this.account,
        //  value: priceNFT_WEI
        //});
    } catch (error) {
        console.error(error);
    }
  }

  async balanceOfCliente(){

    //this.dineroCuenta=await this.ViCOINContract.balanceOf(this.account);
  }
  
}
