import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprarMonedaPageRoutingModule } from './comprar-moneda-routing.module';

import { ComprarMonedaPage } from './comprar-moneda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprarMonedaPageRoutingModule
  ],
  declarations: [ComprarMonedaPage]
})
export class ComprarMonedaPageModule {}
