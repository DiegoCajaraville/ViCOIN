import { Injectable } from '@angular/core';
import { ContractsService } from '../services/contracts.service';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class ComprarMonedaService {
  dineroTienda;
  precio;
  dineroCliente;


  constructor(private contractsService: ContractsService, private databaseService: DatabaseService) { }
  async precioVic(){
    this.precio=this.contractsService.ViCOINSaleContract.tokenPrice();
    return this.precioVic;
  }
  async inicio(){
    this.contractsService.loadMetamask();
    this.contractsService.loadContract();
    this.dineroCliente= await this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);
  }
  async balanceOfTienda(monedaRequerida){
    this.dineroTienda=await this.contractsService.ViCOINContract.balanceOf(this.contractsService.ViCOINSale.address);
    if(this.dineroTienda-monedaRequerida){
      //Adquirir Vic
      this.contractsService.ViCOINSaleContract.buyViCOINs(monedaRequerida*(Math.pow(10,18)),{value: this.precio});
      this.dineroCliente= await this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);

    }else{
      alert("No hay moneda suficiente para comprar");
    }
  }
}