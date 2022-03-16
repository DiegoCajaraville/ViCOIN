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
  patinetesComprados;

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


  async rent1(){
    this.tarifaSeleccionada=1;
    var a = await this.TarifasContract.remaining(0);
    this.tiempoRestante = a.toNumber();
    console.log(this.tiempoRestante);
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = (this.Tarifas.Patinetes().usuarioActual).toString();
      console.log(this.usuarioActual+"------"+this.account);
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
      var b= await this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
      this.allowRent = b.toString();
      console.log(this.allowRent);
      if(this.allowRent >= this.tarifa1){
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
    }
  }




  async rent2(){
    this.tarifaSeleccionada=2;
    var a = await this.TarifasContract.remaining(0);
    this.tiempoRestante = a.toNumber();
    console.log(this.tiempoRestante);
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = (this.Tarifas.Patinetes().usuarioActual).toString();
      console.log(this.usuarioActual+"------"+this.account);
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
      var b= await this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
      this.allowRent = b.toString();
      console.log(BigInt(this.allowRent));
      if(this.allowRent >= this.tarifa2){
        this.TarifasContract.tarifa2(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa2*Math.pow(10,18);
        console.log(c);
        console.log(c.toString());
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        await this.TarifasContract.tarifa2(this.patinete.id,{
          from: this.account,
        });
        alert("Compra realizada");
      }
    }
  }


  async rent3(){
    this.tarifaSeleccionada=3;
    var a = await this.TarifasContract.remaining(0);
    this.tiempoRestante = a.toNumber();
    console.log(this.tiempoRestante);
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = (this.Tarifas.Patinetes().usuarioActual).toString();
      console.log(this.usuarioActual+"------"+this.account);
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
      var b= await this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
      this.allowRent = b.toString();
      console.log(BigInt(this.allowRent));
      if(this.allowRent >= this.tarifa3){
        this.TarifasContract.tarifa3(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa3*Math.pow(10,18);
        console.log(c);
        console.log(c.toString());
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        await this.TarifasContract.tarifa3(this.patinete.id,{
          from: this.account,
        });
        alert("Compra realizada");
      }
    }
  }

  async rent4(){
    this.tarifaSeleccionada=4;
    var a = await this.TarifasContract.remaining(0);
    this.tiempoRestante = a.toNumber();
    console.log(this.tiempoRestante);
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      this.usuarioActual = (this.Tarifas.Patinetes().usuarioActual).toString();
      console.log(this.usuarioActual+"------"+this.account);
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
      var b= await this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
      this.allowRent = b.toString();
      console.log(BigInt(this.allowRent));
      if(this.allowRent >= this.tarifa4){
        this.TarifasContract.tarifa4(this.patinete.id,{
          from: this.account,
        });
      }else{
        alert("Approve the money");
        var c=this.tarifa1*Math.pow(10,18);
        console.log(c);
        console.log(c.toString());
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        await this.TarifasContract.tarifa4(this.patinete.id,{
          from: this.account,
        });
        alert("Compra realizada");
      }
    }
  }


  async rentDemo(){
    this.tarifaSeleccionada=5;
    var a = await this.TarifasContract.remaining(0);
    this.tiempoRestante = a.toNumber();
    console.log(this.tiempoRestante);
    if(this.tiempoRestante>0){
      //El patinete ya esta siendo usado
      //Es necesario comprabar que existen patinetes(no haria falta porque si no hay patinetes disponibles no se llegaria a esta screen)
      
      this.usuarioActual = (this.Tarifas.Patinetes().usuarioActual).toString();
      console.log(this.usuarioActual+"------"+this.account);
      if(this.usuarioActual == this.account){
      }else{

      }
      
    }else{
      var b= await this.ViCOINContract.allowance(this.account,this.TarifasContract.address);
      this.allowRent = b.toString();
      console.log(BigInt(this.allowRent));
      if(this.allowRent >= this.tarifaDemo){
        
        this.TarifasContract.tarifaDemo(this.patinete.id,{
          from: this.account,
        });
      }else{  
        alert("Approve the money");
        var c=this.tarifaDemo*Math.pow(10,18);
        console.log(c);
        console.log(c.toString());
        await this.ViCOINContract.approve(this.TarifasContract.address, BigInt(c),{
          from: this.account,
        });
        console.log("mdsmmlk");
        await this.TarifasContract.tarifaDemo(1,{
          from: this.account,
        });
        alert("Compra realizada");
      }
    }
  }


}
