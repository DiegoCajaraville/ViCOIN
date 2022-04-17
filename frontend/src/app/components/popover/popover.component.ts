import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ContractsService } from 'src/app/services/contracts.service';



@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  patinetesAlquilados: Array<number>=[];

  idPatinete;
  alquiladoAddress;
  
  PatinetesDisponibles;

  totalPatinetes;
  idsDisponibles;


  constructor(private router: Router, private databaseService: DatabaseService, private contractsService: ContractsService) { }
  
  async ngOnInit() {
    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
    this.continuacion();
  }


  


  async continuacion(){
    try{
      this.PatinetesDisponibles=this.contractsService.TarifasContract.getPatinetes();
      var mostrar=true;
  
      this.idsDisponibles = await this.contractsService.TarifasContract.getPatinetes();
      console.log("ids disponibles: "+this.idsDisponibles.toString());
      this.totalPatinetes = await this.contractsService.TarifasContract.totalPatinetes();
      console.log("total patinetes: "+this.totalPatinetes.toNumber());


      for(var a=0; a<this.totalPatinetes.toNumber();a++){
        mostrar=true;
        for(var b=0;b<this.idsDisponibles.length;b++){
          if(a==this.idsDisponibles[b]){
            mostrar=false;
          } 
        }
        if(mostrar){
          console.log("AAA");
          this.patinetesAlquilados.push(a);
        }
      }
    }catch (error) {
        console.error(error);
    }
  }
  patineteAlquiladoInfo(id){
    //Comprobar si la persona que quiere ver los datos del patinete es la persona que lo ha alquilado o es otra persona
    this.idPatinete=id;
    //var a=this.TarifasContract();
    //this.alquiladoAddress= a.toString();
    //if(this.account==this.alquiladoAddress){
    //  window.location="http://localhost:8100/patineteYo/"+this.idPatinete;
    //}else{
      this.router.navigate(['/patineteNoYo/'+this.idPatinete]);
      //window.location="http://localhost:8100/patineteNoYo/"+this.idPatinete;
    //}
  }
}
