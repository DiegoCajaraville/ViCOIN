import { Component, OnInit } from '@angular/core';


import contratoViCOIN from '../../../../contracts/goerli/ViCOIN.json';
import contratoViCOINSale from '../../../../contracts/goerli/ViCOINSale.json';
import contratoTarifas from '../../../../contracts/goerli/Tarifas.json';



declare let window:any;
declare let TruffleContract:any;

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  patinetesAlquilados: Array<number>=[];



  account;
  ViCOIN;
  ViCOINSale;
  Tarifas;
  metamaskProvider;
  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;
  a;
  PatinetesDisponibles;

  totalPatinetes;
  idsDisponibles;


  constructor() { }

  ngOnInit() {
    this.loadMetamask();
    this.loadContract();
 
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
      this.PatinetesDisponibles=this.TarifasContract.getPatinetes();
      var mostrar=true;
  
      this.idsDisponibles = await this.TarifasContract.getPatinetes();
      console.log("ids disponibles: "+this.idsDisponibles.toString());
      this.totalPatinetes = await this.TarifasContract.totalPatinetes();
      console.log("total patinetes: "+this.totalPatinetes.toNumber());


      for(var a=0; a<this.totalPatinetes.toNumber();a++){
        mostrar=true;
        for(var b=0;b<this.idsDisponibles.length;b++){
          if(a==this.idsDisponibles[b]){
            mostrar=false;
          } 
        }
        if(mostrar){
          console.log("AAA");
          this.patinetesAlquilados.push(a);
        }
      }
    }catch (error) {
        console.error(error);
    }
  }

}
