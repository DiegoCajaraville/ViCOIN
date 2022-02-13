import { Component, OnInit } from '@angular/core';
import { PatinetesService } from './patinetes.service';

@Component({
  selector: 'app-patinetes',
  templateUrl: './patinetes.page.html',
  styleUrls: ['./patinetes.page.scss'],
})
export class PatinetesPage implements OnInit {
  
  patinetes = []
  
  constructor(private patinetesService: PatinetesService) { }

  ngOnInit() {
    this.patinetes=this.patinetesService.getPatinetes()
  }
  
}
