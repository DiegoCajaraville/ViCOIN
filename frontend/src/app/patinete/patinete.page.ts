import { Component, OnInit } from '@angular/core';

import { PatinetesService } from '../patinetes/patinetes.service';

import * as L from 'Leaflet';
@Component({
  selector: 'app-patinete',
  templateUrl: './patinete.page.html',
  styleUrls: ['./patinete.page.scss'],
})
export class PatinetePage implements OnInit {
  patinetes=[]
  patinete

  
  constructor(private patinetesService: PatinetesService) {}
 
  ngOnInit() {
    //Alert metamask
    
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
    return 
  }
}
