import { Component, OnInit } from '@angular/core';
import { PatinetesService } from './patinetes.service';
import {MapInfoWindow, MapMarker} from '@angular/google-maps'
@Component({
  selector: 'app-patinetes',
  templateUrl: './patinetes.page.html',
  styleUrls: ['./patinetes.page.scss'],
})
export class PatinetesPage implements OnInit {
  center = {lat: 24, lng: 12};
  zoom = 15;
  display?: google.maps.LatLngLiteral;
  patinetes = []

  constructor(private patinetesService: PatinetesService) { }

  ngOnInit() {
    this.patinetes=this.patinetesService.getPatinetes()
  }

}
