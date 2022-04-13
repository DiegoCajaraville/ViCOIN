import { Component, OnInit } from '@angular/core';
import { Patinete } from '../patinete/patinete.model';

import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';

//@ts-ignore
import L from 'leaflet';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";



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
  constructor(public http:HttpClient, private contractsService: ContractsService, private databaseService: DatabaseService) {}
 
  async ngOnInit() {
    
    //this.contractsService.loadMetamask();

    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
    
    var j = this.contractsService.TarifasContract.getPatinetes();
    this.patinetesComprados = j.toString();
    var b= this.contractsService.ViCOINContract.allowance(this.contractsService.account,this.contractsService.TarifasContract.address);
    this.allowRent= b/Math.pow(10,18);
    var a = this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);
    this.dineroCliente = a/Math.pow(10,18);




    this.id=this.getPatinete();
    

 
    this.map2 = L.map('map2').setView([42.262539326354435, -8.748173066323389], 16);
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
    var marker = L.marker([values[3], values[4]]).addTo(this.map2);
  }
  
  getPatinete(){
    var url = (window.location+"").split('/');
    return url[4];
  }

  async rent(){
    console.log("AllowRent: "+this.allowRent+" Tarifa: "+this.tarifa);
    if(this.tarifa==1){
      if(this.allowRent >= this.tarifa1){
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa1(this.patinete.id,{
          from: this.contractsService.account,
        });
        alert("Alquiler completado");
      }else{
        alert("Approve the money");
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
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa1(this.patinete.id,{
          from: this.contractsService.account,
        });
     
        alert("Alquiler Completado");
      }
    }else if(this.tarifa==2){
      if(this.allowRent >= this.tarifa2){
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa2(this.patinete.id,{
          from: this.contractsService.account,
        });
        alert("Alquiler completado");
      }else{
        alert("Approve the money");
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
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa2(this.patinete.id,{
          from: this.contractsService.account,
        });

        
        alert("Alquiler completado");
      }
    }else if(this.tarifa==3){
      if(this.allowRent >= this.tarifa3){
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa3(this.patinete.id,{
          from: this.contractsService.account,
        });
        alert("Alquiler completado");
      }else{
        alert("Approve the money");
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
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa3(this.patinete.id,{
          from: this.contractsService.account,
        });
        
        alert("Alquiler completado");
      }
    }else if(this.tarifa==4){
      if(this.allowRent >= this.tarifa4){
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa4(this.patinete.id,{
          from: this.contractsService.account,
        });
        alert("Alquiler completado");
      }else{
        alert("Approve the money");
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
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifa4(this.patinete.id,{
          from: this.contractsService.account,
        });
        
        alert("Alquiler completado");
      }
    }else if(this.tarifa==5){
      console.log("abc"+this.allowRent);
      if(this.allowRent >= this.tarifaDemo){
        alert("Realizando alquiler");
        await this.contractsService.TarifasContract.tarifaDemo(this.patinete.id,{
          from: this.contractsService.account,
        });
        alert("Alquiler completado");
      }else{
        alert("Approve the money");
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
        console.log(c);
        alert("Realizando alquiler");

        await this.contractsService.TarifasContract.tarifaDemo(this.patinete.id,{
          from: this.contractsService.account,
        });
        
        alert("Alquiler completado");
      }
    }
  }



  getDatosBBDD(patinete){
    var headers = new HttpHeaders({ 'Authorization': 'Token admin:lproPassword' })
    var params = new HttpParams();
    params=params.set('db', 'ViCOIN');
    params=params.set('q', 'SELECT * FROM patinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1');
    this.http.get<any>("http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true", {
        params, 
        headers
    }).subscribe({
        next: data => {
            if(data.results[0].series == null)
                console.log("No hay registros de este patinete")
            else{
                var keys = data.results[0].series[0].columns;
                var values = data.results[0].series[0].values[0];
                this.patinete={
                  id: patinete+"",
                  latitude: values[3]+"",
                  longitude: values[4]+"",
                  bateria: values[1]+""
                };
                var marker = L.marker([values[3], values[4]]);
                marker.addTo(this.map2);
            }
        },
        error: error => {
            console.error('Ha ocurrido un error al obtener la información de la BBDD', error);
        }
    })
  }
  
}
