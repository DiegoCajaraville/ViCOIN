import { Component, OnInit } from '@angular/core';
import { Patinete } from '../patinete/patinete.model';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';

//@ts-ignore
import L from 'leaflet';




declare let window:any;
declare let TruffleContract:any;

@Component({
  selector: 'app-patinete',
  templateUrl: './patinete.page.html',
  styleUrls: ['./patinete.page.scss'],
})
export class PatinetePage implements OnInit {
  patinete: Patinete;
  tiempoRestante;
  usuarioActual;
  allowRent;
  patinetesComprados;
  dineroCliente;
  tarifa;
  private map2;
  tarifaSeleccionada;
  tarifa1=18;
  tarifa2=15;
  tarifa3=10;
  tarifa4=5;
  tarifaDemo=1;
  id;
  constructor(private contractsService: ContractsService, private databaseService: DatabaseService, private alertCtrl: AlertController) {}
 
  async ngOnInit() {
    
    //this.contractsService.loadMetamask();

    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
    
    var j = this.contractsService.TarifasContract.getPatinetes();
    this.patinetesComprados = j.toString();
    var b= await this.contractsService.ViCOINContract.allowance(this.contractsService.account,this.contractsService.TarifasContract.address);
    console.log("hola mundo");
    this.allowRent= b/Math.pow(10,18);
    var a = this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);
    this.dineroCliente = a/Math.pow(10,18);




    this.id=this.getPatinete();
    

 
    this.map2 = L.map('map2').setView([42.22912736762485, -8.726044981888979], 16);
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
    //@ts-ignore
    L.Icon.Default.ImagePath = "../../assests/icon/";
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamF2aWVyb3Rlcm83IiwiYSI6ImNrenluOWszZjAxeWYzcHFwd2x2NnEzeGoifQ.I_5aq-J6HHpXB0_HYtb1Nw', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.map2);
    
    
    var values = await this.databaseService.getDatosBBDD(this.id);
    L.marker([values[3], values[4]]).addTo(this.map2);
  }
  
  getPatinete(){
    var url = (window.location+"").split('/');
    return url[4];
  }

  async rent(){
    const alert = await this.alertCtrl.create({
      header: 'Realizando Alquiler',
      backdropDismiss: true,
      buttons: ['Ok']
    });
    const alert2 = await this.alertCtrl.create({
      header: 'Aprueba el dinero necesario',
      backdropDismiss: true,
      buttons: ['Ok']
    });


    if(this.tarifa==1){
      if(this.allowRent >= this.tarifa1){
        
        alert.present();
        await this.contractsService.TarifasContract.tarifa1(this.id,{
          from: this.contractsService.account,
        });
        
      }else{
        alert2.present();
        //Aprobar solo el dinero que sea necesario
        var dineroApprove=this.tarifa1-this.allowRent;
        //Comprobar que tiene dinero suficiente para poder hacer el approve
        //if(dineroApprove>this.dineroCliente){
        //  alert("No tiene dinero suficiente");
        //  return;
        //}
        var c=dineroApprove*Math.pow(10,18);
        
        await this.contractsService.ViCOINContract.approve(this.contractsService.TarifasContract.address, BigInt(c),{
          from: this.contractsService.account,
        });
        alert.present();
        await this.contractsService.TarifasContract.tarifa1(this.id,{
          from: this.contractsService.account,
        });
     
     
      }
    }else if(this.tarifa==2){
      if(this.allowRent >= this.tarifa2){
        alert.present();
        await this.contractsService.TarifasContract.tarifa2(this.id,{
          from: this.contractsService.account,
        });
        
      }else{
        alert2.present();
        //Aprobar solo el dinero que sea necesario
        var dineroApprove=this.tarifa1-this.allowRent;
        //Comprobar que tiene dinero suficiente para poder hacer el approve
        //if(dineroApprove>this.dineroCliente){
        //  alert("No tiene dinero suficiente");
        //  return;
        //}
        var c=dineroApprove*Math.pow(10,18);
        
        await this.contractsService.ViCOINContract.approve(this.contractsService.TarifasContract.address, BigInt(c),{
          from: this.contractsService.account,
        });
        alert.present();
        await this.contractsService.TarifasContract.tarifa2(this.id,{
          from: this.contractsService.account,
        });
      }
    }else if(this.tarifa==3){
      if(this.allowRent >= this.tarifa3){
        alert.present();
        await this.contractsService.TarifasContract.tarifa3(this.id,{
          from: this.contractsService.account,
        });
        
      }else{
        alert2.present();
        //Aprobar solo el dinero que sea necesario
        var dineroApprove=this.tarifa1-this.allowRent;
        //Comprobar que tiene dinero suficiente para poder hacer el approve
        //if(dineroApprove>this.dineroCliente){
        //  alert("No tiene dinero suficiente");
        //  return;
        //}
        var c=dineroApprove*Math.pow(10,18);
        
        await this.contractsService.ViCOINContract.approve(this.contractsService.TarifasContract.address, BigInt(c),{
          from: this.contractsService.account,
        });
        alert.present();
        await this.contractsService.TarifasContract.tarifa3(this.id,{
          from: this.contractsService.account,
        });
      }
    }else if(this.tarifa==4){
      if(this.allowRent >= this.tarifa4){
        alert.present();
        await this.contractsService.TarifasContract.tarifa4(this.id,{
          from: this.contractsService.account,
        });
    
      }else{
        alert2.present();
        //Aprobar solo el dinero que sea necesario
        var dineroApprove=this.tarifa1-this.allowRent;
        //Comprobar que tiene dinero suficiente para poder hacer el approve
        //if(dineroApprove>this.dineroCliente){
        //  alert("No tiene dinero suficiente");
        //  return;
        //}
        var c=dineroApprove*Math.pow(10,18);
        
        await this.contractsService.ViCOINContract.approve(this.contractsService.TarifasContract.address, BigInt(c),{
          from: this.contractsService.account,
        });
        alert.present();
        await this.contractsService.TarifasContract.tarifa4(this.id,{
          from: this.contractsService.account,
        });
      }
    }else if(this.tarifa==5){
      console.log("abc"+this.allowRent);
      if(this.allowRent >= this.tarifaDemo){
        alert.present();
        await this.contractsService.TarifasContract.tarifaDemo(this.id,{
          from: this.contractsService.account,
        });
        
      }else{
        alert2.present();
        //Aprobar solo el dinero que sea necesario
        var dineroApprove=this.tarifa1-this.allowRent;
        //Comprobar que tiene dinero suficiente para poder hacer el approve
        //if(dineroApprove>this.dineroCliente){
        //  alert("No tiene dinero suficiente");
        //  return;
        //}
        console.log(dineroApprove);
        var c=dineroApprove*Math.pow(10,18);
        
        await this.contractsService.ViCOINContract.approve(this.contractsService.TarifasContract.address, BigInt(c),{
          from: this.contractsService.account,
        });
        console.log(c);
        alert.present();

        await this.contractsService.TarifasContract.tarifaDemo(this.id,{
          from: this.contractsService.account,
        });       
      }
    }
  }  
}
