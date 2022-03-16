import { Component, OnInit } from '@angular/core';
import { PatinetesService } from './patinetes.service';
import * as L from 'Leaflet';


import contratoViCOIN from '../../../contracts/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ViCOINSale.json';
import contratoTarifas from '../../../contracts/Tarifas.json';


declare let window:any;
declare let TruffleContract:any;

var patinetes=[];

@Component({
  selector: 'app-patinetes',
  templateUrl: './patinetes.page.html',
  styleUrls: ['./patinetes.page.scss'],
})

export class PatinetesPage implements OnInit {

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

  constructor(private patinetesService: PatinetesService) { }
  clickMenuMoneda(){
    window.location.href="http://localhost:8100/comprarMoneda";
  }
  ngOnInit() {
    this.loadMetamask();
    this.loadContract();  
    //Funcion para pillar los datos de la base de datos con los ids en PatinetesDisponibles.

    
    patinetes = this.patinetesService.getPatinetes();
    var map = L.map('map').setView([42.22912736762485, -8.726044981888979], 16);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF2aWVyb3Rlcm83IiwiYSI6ImNrenluOWszZjAxeWYzcHFwd2x2NnEzeGoifQ.I_5aq-J6HHpXB0_HYtb1Nw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(map);
    for (var i=0 ; i < patinetes.length ; i++){
      var marker = L.marker([patinetes[i].latitude, patinetes[i].longitude]).on('click', onClickMarker);; 
      marker.addTo(map);
    }


    function onClickMarker(e){
      for(var k=0; k<patinetes.length;k++){
        if(patinetes[k].latitude==e.latlng.lat){
          if(patinetes[k].longitude==e.latlng.lng){
            window.location.href="http://localhost:8100/patinete?id="+patinetes[k].id;
          }
        }
      }
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
        this.PatinetesDisponibles=this.TarifasContract.getPatinetes();
        
    } catch (error) {
        console.error(error);
    }
  }
}
