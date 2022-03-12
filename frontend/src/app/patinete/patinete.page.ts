import { Component, OnInit } from '@angular/core';

import { PatinetesService } from '../patinetes/patinetes.service';

import * as L from 'Leaflet';

import contratoViCOIN from '../../../contracts/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ViCOINSale.json';
import contratoTarifas from '../../../contracts/Tarifas.json';



declare let window:any;
declare let TruffleContract:any;


@Component({
  selector: 'app-patinete',
  templateUrl: './patinete.page.html',
  styleUrls: ['./patinete.page.scss'],
})
export class PatinetePage implements OnInit {
  patinetes=[];
  patinete;
  tiempoRestante;
  usuarioActual;
  allowRent;
  account;
  ViCOIN;
  ViCOINSale;
  Tarifas;
  metamaskProvider;
  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;
  

  tarifaSeleccionada;
  tarifa1=18;
  tarifa2=15;
  tarifa3=10;
  tarifa4=5;
  tarifaDemo=1;
  
  constructor(private patinetesService: PatinetesService) {}
 
  ngOnInit() {
    this.loadMetamask();
    this.loadContract();
    
    this.patinetes=this.patinetesService.getPatinetes()
    this.patinete=this.getPatinete()
    var map = L.map('map').setView([42.262539326354435, -8.748173066323389], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF2aWVyb3Rlcm83IiwiYSI6ImNrenluOWszZjAxeWYzcHFwd2x2NnEzeGoifQ.I_5aq-J6HHpXB0_HYtb1Nw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(map);
    L.marker([this.patinete.latitude, this.patinete.longitude]).addTo(map);
  }
  getPatinete(){
    var url = (window.location+"").split('=');
    var idURL=url[1];
    for(var i=0;i<this.patinetes.length;i++){
      if(idURL===this.patinetes[i].id) return this.patinetes[i];
    }
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
    } catch (error) {
        console.error(error);
    }
  }


  async rent1(){
    this.tarifaSeleccionada=1;
    console.log("aAAAAAAAAAAAA"+this.tarifaSeleccionada);
    this.tiempoRestante = this.TarifasContract.remaining();
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = this.Tarifas.Patinetes().usuarioActual;
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
        this.allowRent = this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
        if(this.allowRent >= this.tarifa1){
          if(this.tarifaSeleccionada==1){
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }else{
          if(this.tarifaSeleccionada==1){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa1*Math.pow(10,18));
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa2*Math.pow(10,18));
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa3*Math.pow(10,18));
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa4*Math.pow(10,18));
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifaDemo*Math.pow(10,18));
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }
    }
  }


  async rent2(){
    this.tarifaSeleccionada=2;
    console.log("aAAAAAAAAAAAA"+this.tarifaSeleccionada);
    this.tiempoRestante = this.TarifasContract.remaining();
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = this.Tarifas.Patinetes().usuarioActual;
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
        this.allowRent = this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
        if(this.allowRent >= this.tarifa2){
          if(this.tarifaSeleccionada==1){
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }else{
          if(this.tarifaSeleccionada==1){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa1*Math.pow(10,18));
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa2*Math.pow(10,18));
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa3*Math.pow(10,18));
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa4*Math.pow(10,18));
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifaDemo*Math.pow(10,18));
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }
    }
  }


  async rent3(){
    this.tarifaSeleccionada=3;
    console.log("aAAAAAAAAAAAA"+this.tarifaSeleccionada);
    this.tiempoRestante = this.TarifasContract.remaining();
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = this.Tarifas.Patinetes().usuarioActual;
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
        this.allowRent = this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
        if(this.allowRent >= this.tarifa3){
          if(this.tarifaSeleccionada==1){
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }else{
          if(this.tarifaSeleccionada==1){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa1*Math.pow(10,18));
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa2*Math.pow(10,18));
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa3*Math.pow(10,18));
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa4*Math.pow(10,18));
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifaDemo*Math.pow(10,18));
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }
    }
  }

  async rent4(){
    this.tarifaSeleccionada=4;
    this.tiempoRestante = this.TarifasContract.remaining();
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = this.Tarifas.Patinetes().usuarioActual;
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
        this.allowRent = this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
        if(this.allowRent >= this.tarifa4){
          if(this.tarifaSeleccionada==1){
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }else{
          if(this.tarifaSeleccionada==1){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa1*Math.pow(10,18));
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa2*Math.pow(10,18));
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa3*Math.pow(10,18));
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa4*Math.pow(10,18));
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifaDemo*Math.pow(10,18));
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }
    }
  }


  async rentDemo(){
    this.tarifaSeleccionada=5;
    console.log("aAAAAAAAAAAAA"+this.tarifaDemo);
    this.tiempoRestante = this.TarifasContract.remaining();
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = this.Tarifas.Patinetes().usuarioActual;
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
        this.allowRent = this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
        if(this.allowRent >= this.tarifaSeleccionada){
          if(this.tarifaSeleccionada==1){
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }else{
          if(this.tarifaSeleccionada==1){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa1*Math.pow(10,18));
            this.TarifasContract.tarifa1(this.patinete.id);
          }else if(this.tarifaSeleccionada==2){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa2*Math.pow(10,18));
            this.TarifasContract.tarifa2(this.patinete.id);
          }else if(this.tarifaSeleccionada==3){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa3*Math.pow(10,18));
            this.TarifasContract.tarifa3(this.patinete.id);
          }else if(this.tarifaSeleccionada==4){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifa4*Math.pow(10,18));
            this.TarifasContract.tarifa4(this.patinete.id);
          }else if(this.tarifaSeleccionada==5){
            this.ViCOINContract.approve(this.TarifasContract.address,this.tarifaDemo*Math.pow(10,18));
            this.TarifasContract.tarifaDemo(this.patinete.id);
          }
        }
    }
  }


}
