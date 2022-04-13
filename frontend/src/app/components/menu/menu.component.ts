import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ContractsService } from 'src/app/services/contracts.service'; 

import contratoViCOIN from '../../../../contracts/goerli/ViCOIN.json';
import contratoViCOINSale from '../../../../contracts/goerli/ViCOINSale.json';
import contratoTarifas from '../../../../contracts/goerli/Tarifas.json';



declare let window:any;
declare let TruffleContract:any;


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

   
    monedaCliente;
    account;
    constructor(private router: Router, private contractsService: ContractsService, private databaseService: DatabaseService) { }

    async ngOnInit() {
        this.contractsService.loadMetamask();
        await this.contractsService.loadContract();
        var a = await this.contractsService.ViCOINContract.balanceOf(this.contractsService.account);
        this.monedaCliente = a/Math.pow(10,18);
        this.account = this.contractsService.account;
    }

    clickMenuMoneda(){
        this.router.navigate(['/comprarMoneda']);
    }

  



}
