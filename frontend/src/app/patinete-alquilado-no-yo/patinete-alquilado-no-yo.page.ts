
import { Component, OnInit } from '@angular/core';


import { Patinete } from '../patinete/patinete.model';
import { ContractsService } from '../services/contracts.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-patinete-alquilado-no-yo',
  templateUrl: './patinete-alquilado-no-yo.page.html',
  styleUrls: ['./patinete-alquilado-no-yo.page.scss'],
})
export class PatineteAlquiladoNoYoPage implements OnInit {




  public hours: number=0;
  public minutes: number=0;
  public seconds: number=0;

  private timer: any;
  private date= new Date();

  public show: boolean=true;
  public disabled: boolean= false;
  public animate: boolean=false;


  private id;
  patinete: Patinete;
  tiempoRestante;
  constructor(private contractsService: ContractsService, private databaseService: DatabaseService) { }

  async ngOnInit() {

    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
       
    //obtener el id del patinete de la url
    this.id=this.getId();
    //Obtener lo  s datos del patinete de la base de datos
    this.continuacion(); 

  }

  
  getId(){
    var url = (window.location+"").split('/');
    console.log(url[4]);
    return url[4];
  }


  updateTimer(){
    this.date.setHours(this.hours);
    this.date.setMinutes(this.minutes);
    this.date.setSeconds(this.seconds);
    this.date.setMilliseconds(0);
    const time= this.date.getTime();
    this.date.setTime(time - 1000);

    this.hours=this.date.getHours();
    this.minutes=this.date.getMinutes();
    this.seconds=this.date.getSeconds();


    if(this.date.getHours()===0 && this.date.getMinutes()===0 && this.date.getSeconds()===0){
      //STOP INTERVAL
      clearInterval(this.timer);
    }
  }


  reset(){
    this.hours=0;
    this.minutes=0;
    this.seconds=0;
  }


  start(){
    if(this.hours > 0 || this.minutes>0 || this.seconds>0){
      this.disabled=true;
      this.show=false;
      this.updateTimer();
      if(this.seconds>0){
        this.timer=setInterval(()=>{
          this.updateTimer();
        },1000);
      }
    }
  }



  async continuacion(){
    try{ 
        console.log(this.id);
       
        this.tiempoRestante =  await this.contractsService.TarifasContract.remaining(this.id);

        console.log(this.tiempoRestante.toNumber());
        this.hours=(Math.floor(this.tiempoRestante / 0xE10));
        this.minutes=(Math.floor(this.tiempoRestante / 0x3C ) % 0x3C);
        this.seconds=(Math.round(this.tiempoRestante % 0x3C));
        this.start();
    } catch (error) {
        console.error(error);
    }
  }
   
}
