import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ComprarMonedaService } from './comprar-moneda.service';
@Component({
  selector: 'app-comprar-moneda',
  templateUrl: './comprar-moneda.page.html',
  styleUrls: ['./comprar-moneda.page.scss'],
})
export class ComprarMonedaPage implements OnInit {
  precio;
  precioSeleccionado;
  constructor(private ComprarMonedaService: ComprarMonedaService) { }
  
  ngOnInit() {
    this.precio = this.ComprarMonedaService.precioVic();
  }
  comprarMoneda(){
    this.ComprarMonedaService.inicio();
    this.ComprarMonedaService.balanceOfTienda(this.precioSeleccionado); 
  }
}
