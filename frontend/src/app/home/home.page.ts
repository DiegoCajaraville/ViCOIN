import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import contratoViCOIN from '../../../contracts/goerli/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/goerli/ViCOINSale.json';
import contratoTarifas from '../../../contracts/goerli/Tarifas.json';


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
 

    constructor(private HomeService: HomeService, public http:HttpClient, private router: Router) {}
    ngOnInit() {
        this.getDatosBBDD(1);
        this.loadMetamask();
        this.loadContract();
     
    }    



    /*
    curl 
    -G 'http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true' 
    -H "Authorization: Token admin:lproPassword" 
    --data-urlencode "db=ViCOIN" 
    --data-urlencode "q=SELECT * FROM patinetes WHERE idPatinete='1' ORDER BY time DESC LIMIT 1"
    */

    getDatosBBDD(patinete){

        console.log("Realizar busqueda BBDD")
        console.log('SELECT * FROM patinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1')

        var headers = new HttpHeaders({ 'Authorization': 'Token admin:lproPassword' })

        var params = new HttpParams();
        params=params.set('db', 'ViCOIN');
        params=params.set('q', 'SELECT * FROM patinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1');
   
        this.http.get<any>("http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true", {
            params, 
            headers
        }).subscribe({
            next: data => {

                if(data.results[0].series == null)
                    console.log("No hay registros de este patinete")
                else{
                    
                    var keys = data.results[0].series[0].columns;
                    var values = data.results[0].series[0].values[0];
                    
                    for(var i=0; i<keys.length; i++){
                        console.log(keys[i] + " = " + values[i]);
                    }
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
            this.ViCOINContract= await this.ViCOIN.at('0x30FeD49F1808F83a2d1b4cf26C275DE66E4eE950');
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


    clickAdmin(){
        if(this.account==("0xEC1b2cBF852DbeA58C6B489779F4849E67EcfA0D").toLowerCase()){
            this.router.navigate(['/admin']);
        }else{
            //PopOver error no eres admin
            alert("snd");
        }
    }
}