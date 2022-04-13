import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

    constructor(private contractsService: ContractsService, private databaseService: DatabaseService, private router: Router) {}
    ngOnInit() {
        this.contractsService.loadMetamask();
        this.contractsService.loadContract();
        this.databaseService.getDatosBBDD(0);
    }    

    clickAdmin(){
        
        if(this.contractsService.account==("0xEC1b2cBF852DbeA58C6B489779F4849E67EcfA0D").toLowerCase()){
            this.router.navigate(['/admin']);
        }else{
            //PopOver error no eres admin
            alert("snd");
        }
    }
}