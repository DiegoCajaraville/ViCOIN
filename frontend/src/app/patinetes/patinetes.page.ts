import { Component, OnInit } from '@angular/core';
import L from 'Leaflet';

import { Patinete } from '../patinete/patinete.model';
import { Router } from '@angular/router'


import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';

import { ContractsService } from '../services/contracts.service'; 
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-patinetes',
  templateUrl: './patinetes.page.html',
  styleUrls: ['./patinetes.page.scss'],
})

export class PatinetesPage implements OnInit {
  route=this.router;
  PatinetesDisponibles;
  private map;
  tarifa;

  //Acceder a esta variable para ver todos los patinetes disponibles
  patinetes: Patinete[]=[];
  
  totalPatinetes;
  idsDisponibles;
  
  constructor(private popCtrl: PopoverController, public router: Router, private contractsService: ContractsService, private databaseService: DatabaseService) { }
  clickMenuMoneda(){
    this.router.navigate(['/comprarMoneda']);
  }
  async ngOnInit() {    
    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
    this.PatinetesDisponibles = await this.contractsService.TarifasContract.getPatinetes();
    this.continuacion();
  }

  

  async continuacion(){
    try{
      //var b = await this.contractsService.TarifasContract.getPatinetes();
      this.map = new L.map('map').setView([42.22912736762485, -8.726044981888979], 16);
      L.Icon.Default.ImagePath = "../../assests/icon/";
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF2aWVyb3Rlcm83IiwiYSI6ImNrenluOWszZjAxeWYzcHFwd2x2NnEzeGoifQ.I_5aq-J6HHpXB0_HYtb1Nw', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'your.mapbox.access.token'
        }).addTo(this.map);

        
      console.log(this.PatinetesDisponibles.length);
      for(var c=1;c<this.PatinetesDisponibles.length;c++){

        console.log(this.PatinetesDisponibles[c].toNumber());
        
        var values =await  this.databaseService.getDatosBBDD(this.PatinetesDisponibles[c].toNumber());

        console.log(values);
        this.patinetes.push({
          id: this.PatinetesDisponibles[c]+"",
          latitude: values[3]+"",
          longitude: values[4]+"",
          bateria: values[1]+""
        });
       
        var marker =new  L.marker([values[3], values[4]]).on('click', this.onClickMarker);
        marker.myId=this.PatinetesDisponibles[c];
        marker.myRouter=this.router;
        
        
        marker.addTo(this.map);
      }

      console.log("mE CNSDFBVJKNSDFNVJKSDN");
      
  
  
      
    }catch (error) {
      console.error(error);
    } 
  }
  



  async patinetesAlquilados(){
    const popover= this.popCtrl.create({
      component: PopoverComponent
    })
    return (await popover).present();
  }

  onClickMarker(e){

    var router1=e.target.myRouter;
    router1.navigate(['/patinete/'+e.target.myId]);
  }  
}