import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketBusPageRoutingModule } from './ticket-bus-routing.module';

import { TicketBusPage } from './ticket-bus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketBusPageRoutingModule
  ],
  declarations: [TicketBusPage]
})
export class TicketBusPageModule {}
