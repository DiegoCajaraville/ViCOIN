import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {


  precioSeleccionado;

  constructor(private contractsService: ContractsService, private databaseService: DatabaseService, private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
  }


  async fund(){
    //await this.contractsService.ViCOINSaleContract.getFunds();
    const alert = await this.alertCtrl.create({
      header: 'Fondos recogidos:',
      subHeader: 'SubHeader',
    });
  
    await alert.present();
  }

  async supply(){
    var dinero= this.precioSeleccionado*Math.pow(10,18);
    this.contractsService.ViCOINSaleContract.moreSuply(dinero);
    const alert = await this.alertCtrl.create({
      header: 'Moneda añadida',
      subHeader: 'Total restante: ',
    });
  }

}
