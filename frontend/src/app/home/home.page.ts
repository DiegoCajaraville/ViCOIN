import { Component } from '@angular/core';
import { HomeService } from './home.service';


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
    dineroCuenta;



    account;
    ViCOIN;
    ViCOINSale;
    Tarifas;
    metamaskProvider;
    ViCOINContract;
    ViCOINSaleContract;
    TarifasContract;
    //Cuenta seleccionada por el usuario
    

    constructor(private HomeService: HomeService) {}
    ngOnInit() {
        this.loadMetamask();
        console.log("AAAAAAAAAAAAA");
        this.loadContract();
        console.log("sdfvszdaszdfszd");
        this.balanceOfCliente();
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
            this.ViCOINContract= await this.ViCOIN.at('0xe8e781E9F26b21a0319bac6dc7e2843a86b29eaf');
            //const beta= await this.ViCOINSaleContract.tokenPrice();
            const alfa=await this.ViCOINContract.balanceOf(this.account);
            console.log(alfa);
            //this.dineroCuenta=await this.ViCOINContract.balanceOf(this.account);
            //this.ViCOINContract.address;
            //console.log("Contratos cargados");
            //console.log(this.ViCOINContract.balanceOf(this.account));
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
    
      async balanceOfCliente(){

        //this.dineroCuenta=await this.ViCOINContract.balanceOf(this.account);
      }



}