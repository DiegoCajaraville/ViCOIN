import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { PatinetesService } from '../patinetes/patinetes.service';
import { Patinete } from './patinete.model';
@Component({
  selector: 'app-patinete',
  templateUrl: './patinete.page.html',
  styleUrls: ['./patinete.page.scss'],
})
export class PatinetePage implements OnInit {
  patinetes=[]
  patinete
  URL= window.location
  
  constructor(private patinetesService: PatinetesService) {}

  ngOnInit() {
    this.patinetes=this.patinetesService.getPatinetes()
    this.patinete=this.getPatinete()
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
