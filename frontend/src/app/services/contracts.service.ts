import { Injectable } from '@angular/core';


import contratoViCOIN from '../../../contracts/goerli/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/goerli/ViCOINSale.json';
import contratoTarifas from '../../../contracts/goerli/Tarifas.json';


declare let window:any;
declare let TruffleContract:any;


@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  metamaskProvider;
  account;

  ViCOIN;
  ViCOINSale;
  Tarifas;

  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;
  constructor() {
    this.loadMetamask();
    this.loadContract();
    
   }
   
  async loadMetamask(){
    if (window.ethereum) {

        try{

            this.metamaskProvider=window.ethereum;
            var accounts = await this.metamaskProvider.request({ method: "eth_requestAccounts" });

            if( accounts.length == 0 )
                alert("Iniciar sesión en metamask");

            else{
                // Debido a bug con AlphaWallet
                if(Array.isArray(accounts))
                    this.account = accounts[0];
                else {
                    accounts = [accounts.substring(1, accounts.length-1)];
                    this.account = accounts[0];
                }
            }

        } catch(error){
            if(error.code===4001){
                alert("123");
            }
        }
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
        

    } catch (error) {
        console.error(error);
    }
  }


}
