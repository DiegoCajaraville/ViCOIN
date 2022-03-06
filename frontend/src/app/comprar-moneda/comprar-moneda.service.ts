import { Injectable } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';

import { HomeService } from '../home/home.service';

@Injectable({
  providedIn: 'root'
})
export class ComprarMonedaService {
  dineroTienda;
  precio;
  dineroCliente;
  constructor(private HomeService: HomeService) { }
  async precioVic(){
    this.precio=this.HomeService.ViCOINSaleContract.tokenPrice();
    return this.precioVic;
  }
  async inicio(){
    this.HomeService.loadMetamask();
    this.HomeService.loadContract();
    this.dineroCliente=this.HomeService.balanceOfCliente();
  }

  async balanceOfTienda(monedaRequerida){
    
    this.dineroTienda=await this.HomeService.ViCOINContract.balanceOf(this.HomeService.ViCOINSale.address);
    if(this.dineroTienda-monedaRequerida){
      //Adquirir Vic
      this.HomeService.ViCOINSaleContract.buyViCOINs(monedaRequerida*(Math.pow(10,18)),{value: this.precio});



    }else{
      alert("No hay moneda suficiente para comprar");
      return;
    }
  }
}
