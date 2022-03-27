import { Component, OnInit } from '@angular/core';
import * as L from 'Leaflet';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Patinete } from '../patinete/patinete.model';

import contratoViCOIN from '../../../contracts/ropsten/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ropsten/ViCOINSale.json';
import contratoTarifas from '../../../contracts/ropsten/Tarifas.json';


import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { VirtualTimeScheduler } from 'rxjs';






declare let window:any;
declare let TruffleContract:any;

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
  map;
  tarifa;

  //Acceder a esta variable para ver todos los patinetes disponibles
  patinetes: Patinete[]=[];
  
  totalPatinetes;
  idsDisponibles;
  
  constructor(public http:HttpClient, private popCtrl: PopoverController) { }
  clickMenuMoneda(){
    window.location.href="http://localhost:8100/comprarMoneda";
  }
  async ngOnInit() {
    

    this.loadMetamask();

    this.loadContract();

    //Funcion para pillar los datos de la base de datos con los ids en PatinetesDisponibles.

    

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
      this.PatinetesDisponibles= await this.TarifasContract.getPatinetes();
  
      
        
    
      for(var c=0;c<this.PatinetesDisponibles.length;c++){
        console.log(this.PatinetesDisponibles[c].toNumber());
        this.getDatosBBDD(this.PatinetesDisponibles[c].toNumber());
      }
  
      this.map = L.map('map').setView([42.22912736762485, -8.726044981888979], 16);
      L.Icon.Default.ImagePath = "../../assests/icon/";
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF2aWVyb3Rlcm83IiwiYSI6ImNrenluOWszZjAxeWYzcHFwd2x2NnEzeGoifQ.I_5aq-J6HHpXB0_HYtb1Nw', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'your.mapbox.access.token'
        }).addTo(this.map);
  
  
      
    }catch (error) {
      console.error(error);
    } 
  }
  



  async patinetesAlquilados(){
    //Crear popUp
    
    //popUp
    const popover= this.popCtrl.create({
      component: PopoverComponent
    })
    return (await popover).present();
  }





  onClickMarker(e){
    window.location.href="http://localhost:8100/patinete/"+e.target.myId;
  }


  getDatosBBDD(patinete){

    //console.log("Realizar busqueda BBDD")
    //console.log('SELECT * FROM patinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1')

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
              
                this.patinetes.push({
                  id: patinete+"",
                  latitude: values[3]+"",
                  longitude: values[4]+"",
                  bateria: values[1]+""
                });
               
                  var marker = L.marker([values[3], values[4]]).on('click', this.onClickMarker);
                  marker.myId=patinete;
                  marker.addTo(this.map);
                
                
                //for(var i=0; i<keys.length; i++){
                    //console.log(keys[i] + " = " + values[i]);
                //}


            }
        },
        error: error => {
            console.error('Ha ocurrido un error al obtener la información de la BBDD', error);
        }
    })
  }
  
}