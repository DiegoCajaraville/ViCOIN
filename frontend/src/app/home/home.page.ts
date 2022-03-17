import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

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
 

    constructor(private HomeService: HomeService, public http:HttpClient ) {}
    ngOnInit() {
        this.getDatosBBDD("patinete1");
        this.loadMetamask();
        console.log("AAAAAAAAAAAAA");
        this.loadContract();
        console.log("sdfvszdaszdfszd");
        this.balanceOfCliente();
    }    



    /*
    curl 
    -G 'http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true' 
    -H "Authorization: Token admin:lproPassword" 
    --data-urlencode "db=pruebas" 
    --data-urlencode "q=SELECT * FROM patinete1 ORDER BY time DESC LIMIT 1"
    */

    getDatosBBDD(patinete){

        var headers = new HttpHeaders({ 'Authorization': 'Token admin:lproPassword' })

        var params = new HttpParams();
        params=params.set('db', 'pruebas');
        params=params.set('q', 'SELECT * FROM ' + patinete + ' ORDER BY time DESC LIMIT 1');
   
        this.http.get<any>("http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true", {
            params, 
            headers
        }).subscribe({
            next: data => {

                var keys = data.results[0].series[0].columns;
                var values = data.results[0].series[0].values[0];
                
                for(var i=0; i<keys.length; i++){
                    console.log(keys[i] + " = " + values[i]);
                }
            },
            error: error => {
                console.error('Ha ocurrido un error al obtener la información de la BBDD', error);
            }
        })
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
            this.ViCOINContract= await this.ViCOIN.at('0x24B09781e928b16afE34b7C35F4481565d421F7A');
            //const beta= await this.ViCOINSaleContract.tokenPrice();
            const beta= this.ViCOINSaleContract.address;
            var alfa=await this.ViCOINContract.balanceOf(beta);
            
            console.log(beta);
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