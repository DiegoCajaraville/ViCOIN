import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home/home.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  monedaCliente;
  account=this.HomeService.account;
  constructor(private HomeService: HomeService) { }

  ngOnInit() {
    this.monedaCliente=this.HomeService.balanceOfCliente();
  }
  clickMenuMoneda(){
    window.location.href="http://localhost:8100/comprarMoneda";
  }
}
