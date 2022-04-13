import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ContractsService } from '../services/contracts.service';
import { Data } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private contractsService: ContractsService, private databaseService: DatabaseService) { }

  async ngOnInit() {
    this.contractsService.loadMetamask();
    await this.contractsService.loadContract();
  }


  fund(){

  }

  supply(){
    
  }

}
