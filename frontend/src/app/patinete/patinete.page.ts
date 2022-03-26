import { Component, OnInit } from '@angular/core';

import { PatinetesService } from '../patinetes/patinetes.service';
import { PatinetesPage } from '../patinetes/patinetes.page';
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
  patinetesComprados;

  tarifa;

  tarifaSeleccionada;
  tarifa1=18;
  tarifa2=15;
  tarifa3=10;
  tarifa4=5;
  tarifaDemo=1;
  
  constructor(private patinetesPage: PatinetesPage) {}
 
  ngOnInit() {
    L.Icon.Default.ImagePath = "../../assests/icon/";


    this.loadMetamask();
    this.loadContract();
    

    this.patinete=this.getPatinete();

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
    var url = (window.location+"").split('/');
    var idURL=url[4];
    console.log(idURL);
    for(var i=0;i<this.patinetesPage.patinetes.length;i++){
      if(idURL==this.patinetesPage.patinetes[i].id) return this.patinetesPage.patinetes[i];
    }
  }

  async loadMetamask(){
    if (window.ethereum) {
      try{
        this.metamaskProvider=window.ethereum;
        
        const accounts= await this.metamaskProvider.request({ method: "eth_requestAccounts" });
        
        if(accounts.length==0){
          alert("Iniciar sesión en metamask");
        }else{
          this.account=accounts[0];
          console.log(this.account);
        }
      }catch(error){
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
        this.ViCOINContract= await this.ViCOIN.at('0x24B09781e928b16afE34b7C35F4481565d421F7A');
        var j = await this.TarifasContract.getPatinetes();
        this.patinetesComprados = j.toString();
        console.log("aaaa"+this.patinetesComprados);
    } catch (error) {
        console.error(error);
    }
  }





  async renting(tar){
    console.log(tar);
    if(tar==1){
      if(this.allowRent >= this.tarifa1){
        console.log("comprar");
        this.TarifasContract.tarifa1(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa1*Math.pow(10,18);
        
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        
        await this.TarifasContract.tarifa1(this.patinete.id,{
          from: this.account,
        });
        console.log("sk");
        alert("Compra realizada");
      }
    }else if(tar==2){
      if(this.allowRent >= this.tarifa2){
        console.log("comprar");
        this.TarifasContract.tarifa2(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa1*Math.pow(10,18);
        
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        
        await this.TarifasContract.tarifa2(this.patinete.id,{
          from: this.account,
        });
        console.log("sk");
        alert("Compra realizada");
      }
    }else if(tar==3){
      if(this.allowRent >= this.tarifa3){
        console.log("comprar");
        this.TarifasContract.tarifa3(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa1*Math.pow(10,18);
        
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        
        await this.TarifasContract.tarifa3(this.patinete.id,{
          from: this.account,
        });
        console.log("sk");
        alert("Compra realizada");
      }
    }else if(tar==4){
      if(this.allowRent >= this.tarifa4){
        console.log("comprar");
        this.TarifasContract.tarifa4(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa1*Math.pow(10,18);
        
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        
        await this.TarifasContract.tarifa4(this.patinete.id,{
          from: this.account,
        });
        console.log("sk");
        alert("Compra realizada");
      }
    }else if(tar==5){
      
      if(this.allowRent >= this.tarifaDemo){
        console.log("comprar");
        this.TarifasContract.tarifaDemo(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa1*Math.pow(10,18);
        
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        
        await this.TarifasContract.tarifaDemo(this.patinete.id,{
          from: this.account,
        });
        console.log("sk");
        alert("Compra realizada");
      }
    }
  }
  
}
