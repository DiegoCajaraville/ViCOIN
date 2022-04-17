import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';
import { AlertController } from '@ionic/angular';
import { AdminService } from './admin.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {


  
  peticion;

  constructor(private router: Router, private adminService: AdminService,private contractsService: ContractsService, private databaseService: DatabaseService, private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();

    if(this.contractsService.account!=("0x76A431B17560D46dE8430435001cBC66ae04De46").toLowerCase()){
      this.router.navigate(['/']);
    }

    this.adminService.peticion().subscribe((resp:any) =>{
      this.peticion=resp.result/Math.pow(10,18);
    });
  }


  async fund(){
    await this.contractsService.ViCOINSaleContract.getFunds({from: this.contractsService.account});
    const alert = await this.alertCtrl.create({
      header: 'Fondos recogidos:',
      backdropDismiss: true,
      buttons: ['Ok']
    });
  
    await alert.present();
  }

  async supply(precioSeleccionado){
    console.log(precioSeleccionado);
    var dinero = precioSeleccionado*Math.pow(10,18);
    await this.contractsService.ViCOINSaleContract.moreSupply(BigInt(dinero),{
      from: this.contractsService.account
    });
    const alert = await this.alertCtrl.create({
      header: 'Moneda añadida',
      subHeader: 'Total restante: ',
    });
  }

}
