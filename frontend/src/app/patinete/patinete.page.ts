import { Component, OnInit } from '@angular/core';
import { Patinete } from '../patinete/patinete.model';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';
import { LoadingController } from '@ionic/angular';

//@ts-ignore
import L from 'leaflet';




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
    textButton = "ALQUILAR";
    approvedTransaction = false;

    constructor(
        private contractsService: ContractsService, 
        private databaseService: DatabaseService, 
        private alertCtrl: AlertController,
        public loadingController: LoadingController
    ) {}
 
    async ngOnInit() {
        
        this.contractsService.loadMetamask();

        this.contractsService.loadMetamask();
        await this.contractsService.loadContract();
        
        var j = this.contractsService.TarifasContract.getPatinetes();
        this.patinetesComprados = j.toString();
        var b= await this.contractsService.ViCOINContract.allowance(this.contractsService.account,this.contractsService.TarifasContract.address);
        
        this.allowRent= b/Math.pow(10,18);
    
        var a = await this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);
        this.dineroCliente = a/Math.pow(10,18);

        this.id=this.getPatinete();

        // Cargamos el mapa
        var values = await  this.databaseService.getDatosBBDD(this.id);

        if(values!=undefined){

            this.map2 = L.map('map2').setView([values[3], values[4]], 16);
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
            
            L.marker([values[3], values[4]]).addTo(this.map2);
        }
        else{
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
        }

        
    }
  
    getPatinete(){
        var url = (window.location+"").split('/');
        return url[4];
    }

    async rent(){
        
        var b = await this.contractsService.ViCOINContract.allowance(this.contractsService.account,this.contractsService.TarifasContract.address);
        this.allowRent= b/Math.pow(10,18);

        const alert1 = await this.alertCtrl.create({
            header: "No tiene saldo suficiente",
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const alert2 = await this.alertCtrl.create({
            header: 'Aprobando el dinero necesario',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const alert3= await this.alertCtrl.create({
            header: 'Alquiler completado',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });
        
        const alert4= await this.alertCtrl.create({
            header: 'Realizando alquiler',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const alert5= await this.alertCtrl.create({
            header: 'No ha seleccionado una tarifa',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const alert6= await this.alertCtrl.create({
            header: 'Siga los pasos que se le indiquen a continuación...',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const alertFin = await this.alertCtrl.create({
            header: 'Completado. El patinete encenderá en breves...',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere un momento...',
            duration: 5000
        });

        const loadingApprove = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere unos segundos... Pulse CONFIRMAR la transacción.',
            duration: 10000
        });

        const loadingWait = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'No se ha minado la transacción todavía. Espere unos segundos...',
            duration: 3000
        });

        var precioTarifa = 0;

        if( this.tarifa == 1 )
            precioTarifa = this.tarifa1
        if( this.tarifa == 2 )
            precioTarifa = this.tarifa2
        if( this.tarifa == 3 )
            precioTarifa = this.tarifa3
        if( this.tarifa == 4 )
            precioTarifa = this.tarifa4
        if( this.tarifa == 5 )
            precioTarifa = this.tarifaDemo
        
        // Comprobamos que haya elegido una tarifa
        if( precioTarifa == 0 ){
            await alert5.present();
            return;
        }
        // Comprobamos que tenga suficiente saldo para el pago de la tarifa
        if( this.dineroCliente < precioTarifa ){
            await alert1.present();
            return;
        }

        // Comprobamos si ha dado tiempo a minar la transaccion
        if( (document.getElementById('rentButton').innerHTML == "CONFIRMAR") && (this.allowRent < precioTarifa) ){
            await loadingWait.present();
            await new Promise(r => setTimeout(r, 3000));
            await this.loadingController.dismiss().then(() => console.log('dismissed'));
            return;
        }
        // Hacemos el "approve" del dinero necesario en función del approved previamente
        if( this.allowRent < precioTarifa ){

            //Aprobar solo el dinero que sea necesario
            var dineroApprove = precioTarifa - this.allowRent;
            var c = dineroApprove*Math.pow(10,18);

            await alert6.present();
            await new Promise(r => setTimeout(r, 1500));
            await alert6.dismiss();


            await this.contractsService.ViCOINContract.approve(this.contractsService.TarifasContract.address, BigInt(c),{
                from: this.contractsService.account,
                to: "0x30FeD49F1808F83a2d1b4cf26C275DE66E4eE950"
            }).once("transactionHash", async function(){
                //await alert2.present();
                document.getElementById('rentButton').innerHTML = "CONFIRMAR"
                this.approvedTransaction = true;

                await loadingApprove.present();
                
                await new Promise(r => setTimeout(r, 10000));
                await this.loadingController.dismiss().then(() => console.log('dismissed'));

                //this.textButton = 
                
                //await this.pagos(true)
            })
            .then(async function(){
                alert("HA terminado")
            });
        }

        //await this.loadingController.dismiss().then(() => console.log('dismissed'));
        await this.pagos(false)
        
    }  

    async pagos(esperar){

        const alertFin = await this.alertCtrl.create({
            header: 'Completado. El patinete encenderá en breves...',
            backdropDismiss: true,
            buttons: ['Ok'],
            cssClass:'buttonCss'
        });

        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere un momento...',
            duration: 5000
        });

        if(esperar)
            await new Promise(r => setTimeout(r, 15000));
        
        // Hacemos la transaccion del dinero para el alquiler
        if( this.tarifa == 1 ) {

            await this.contractsService.TarifasContract.tarifa1(this.id,{
                from: this.contractsService.account,
            }).once("transactionHash", async function(){
                await loading.present();
            });
        }

        if( this.tarifa == 2 ) {

            await this.contractsService.TarifasContract.tarifa2(this.id,{
                from: this.contractsService.account,
            }).once("transactionHash", async function(){
                await loading.present();
            });
        }

        if( this.tarifa == 3 ) {

            await this.contractsService.TarifasContract.tarifa3(this.id,{
                from: this.contractsService.account,
            }).once("transactionHash", async function(){
                await loading.present();
            });
        }

        if( this.tarifa == 4 ) {

            await this.contractsService.TarifasContract.tarifa4(this.id,{
                from: this.contractsService.account,
            }).once("transactionHash", async function(){
                await loading.present();
            });
        }

        if( this.tarifa == 5 ) {

            await this.contractsService.TarifasContract.tarifaDemo(this.id,{
                from: this.contractsService.account,
            }).once("transactionHash", async function(){
                await loading.present();
                await new Promise(r => setTimeout(r, 5000));

                //await this.loadingController.dismiss().then(() => console.log('dismissed'));
                //await alert.present();
                await alertFin.present();
                //@ts-ignore
                document.getElementById('rentButton').disabled = true
                //window.location.reload(); 
            });

            //} catch (e) {
            //    alert("PROBLEMAS ABAJO 2.0 :V")
            //    alert(e);
            //}
        }
    }
     
}
