import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ContractsService } from '../services/contracts.service';


@Component({
  selector: 'app-comprar-moneda',
  templateUrl: './comprar-moneda.page.html',
  styleUrls: ['./comprar-moneda.page.scss'],
})
export class ComprarMonedaPage implements OnInit {
  precio=0.01;
  dineroCliente;
  disponibleAdmin;

  constructor(private contractsService: ContractsService, private alertCtrl: AlertController) { }
  
  async ngOnInit() {
    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
    var a= await this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);
    this.dineroCliente = a/Math.pow(10,18);
    
  }

  async comprarMoneda(precioSeleccionado){
    var address = this.contractsService.ViCOINSaleContract.address; 
    console.log(address);
    this.disponibleAdmin = await this.contractsService.ViCOINContract.balanceOf(address);
    console.log(this.disponibleAdmin.toString());
    console.log(precioSeleccionado);
    if( (this.disponibleAdmin-precioSeleccionado*Math.pow(10,18)) >0 ){
      //Se puede comprar
      var b=this.precio*precioSeleccionado*Math.pow(10,18);   
      var c=(precioSeleccionado*Math.pow(10,18));
      const alert1 = await this.alertCtrl.create({
        header: 'En breves su saldo será actualizado',
        backdropDismiss: true,
        buttons: ['Ok']
      });
      this.contractsService.ViCOINSaleContract.buyViCOINS(c.toString(),{from: this.contractsService.account,value: b.toString()}).once("transactionHash", async function(){
        await alert1.present();
      });
    }
  }
}
