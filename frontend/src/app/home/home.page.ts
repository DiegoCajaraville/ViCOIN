import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

    constructor(private contractsService: ContractsService, private databaseService: DatabaseService, private router: Router, private http: HttpClient) {}
    ngOnInit() {
        this.contractsService.loadMetamask();
        this.contractsService.loadContract();
        this.databaseService.getDatosBBDD(0);
    }    

    clickAdmin(){
        if(this.contractsService.account==("0x76A431B17560D46dE8430435001cBC66ae04De46").toLowerCase()){
            this.router.navigate(['/admin']);
        }
    }
}