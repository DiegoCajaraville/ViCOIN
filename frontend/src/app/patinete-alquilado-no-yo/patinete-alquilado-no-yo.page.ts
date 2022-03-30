import { getLocaleId } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Patinete } from '../patinete/patinete.model';
import contratoViCOIN from '../../../contracts/ropsten/ViCOIN.json';
import contratoViCOINSale from '../../../contracts/ropsten/ViCOINSale.json';
import contratoTarifas from '../../../contracts/ropsten/Tarifas.json';






declare let window:any;
declare let TruffleContract:any;
@Component({
  selector: 'app-patinete-alquilado-no-yo',
  templateUrl: './patinete-alquilado-no-yo.page.html',
  styleUrls: ['./patinete-alquilado-no-yo.page.scss'],
})
export class PatineteAlquiladoNoYoPage implements OnInit {


  account;
  ViCOIN;
  ViCOINSale;
  Tarifas;
  metamaskProvider;
  ViCOINContract;
  ViCOINSaleContract;
  TarifasContract;


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
  constructor(public http:HttpClient) { }

  ngOnInit() {

    this.loadMetamask();
    this.loadContract();

    //obtener el id del patinete de la url
    this.id=this.getId();
    //Obtener los datos del patinete de la base de datos
    this.getDatosBBDD(this.id);
   
   

  }

  
  getId(){
    var url = (window.location+"").split('/');
    return url[4];
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
                this.recargaTiempo();
            }
        },
        error: error => {
            console.error('Ha ocurrido un error al obtener la información de la BBDD', error);
        }
    })
  }


  async recargaTiempo(){

    
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

  async loadMetamask(){
    if (window.ethereum) {
      try{
        this.metamaskProvider=window.ethereum;
        
        const accounts= await this.metamaskProvider.request({ method: "eth_requestAccounts" });
        
        if(accounts.length==0){
          alert("Iniciar sesión en metamask");
        }else{
          this.account=accounts[0];
          console.log(this.account);
        }
      }catch(error){
        if(error.code===4001){
          alert("123");
        }
      }
    }else 
        alert("No ethereum browser is installed. Try it installing MetaMask ");
  } 


  async loadContract(){
    try{
        //Creamos la estructura del contrato
        this.ViCOIN=TruffleContract(contratoViCOIN);
        this.ViCOINSale = TruffleContract(contratoViCOINSale);
        this.Tarifas = TruffleContract(contratoTarifas);
        
        // Nos conectamos al contrato a través de la cuenta del wallet (Metamask)
        this.ViCOIN.setProvider(this.metamaskProvider);
        this.ViCOINSale.setProvider(this.metamaskProvider);
        this.Tarifas.setProvider(this.metamaskProvider);

        this.ViCOINSaleContract = await this.ViCOINSale.deployed();
        this.TarifasContract = await this.Tarifas.deployed();
        this.ViCOINContract= await this.ViCOIN.at('0x24B09781e928b16afE34b7C35F4481565d421F7A');
        var j = await this.TarifasContract.getPatinetes();
        this.tiempoRestante =  await this.TarifasContract.remaining(this.id);

        console.log(this.tiempoRestante.toNumber());
        this.hours=(Math.floor(this.tiempoRestante / 0xE10));
        this.minutes=(Math.floor(this.tiempoRestante / 0x3C ) % 0x3C);
        this.seconds=(Math.round(this.tiempoRestante % 0x3C));
        console.log("Horas: "+this.hours+" Minutos: "+this.minutes+" Segundos: "+this.seconds);
        this.start();
    } catch (error) {
        console.error(error);
    }
  }
   
}
