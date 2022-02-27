import { Component, OnInit } from '@angular/core';
import { PatinetesService } from './patinetes.service';
import * as L from 'Leaflet';

var patinetes=[];

@Component({
  selector: 'app-patinetes',
  templateUrl: './patinetes.page.html',
  styleUrls: ['./patinetes.page.scss'],
})

export class PatinetesPage implements OnInit {

  constructor(private patinetesService: PatinetesService) { }
  clickMenuMoneda(){
    window.location.href="http://localhost:8100/comprarMoneda";
  }
  ngOnInit() {
    patinetes = this.patinetesService.getPatinetes()
    var map = L.map('map').setView([42.22912736762485, -8.726044981888979], 16);
    for (var i=0 ; i < patinetes.length ; i++){
      
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF2aWVyb3Rlcm83IiwiYSI6ImNrenluOWszZjAxeWYzcHFwd2x2NnEzeGoifQ.I_5aq-J6HHpXB0_HYtb1Nw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(map);
  
  
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
}
