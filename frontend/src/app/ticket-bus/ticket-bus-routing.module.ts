import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketBusPage } from './ticket-bus.page';

const routes: Routes = [
  {
    path: '',
    component: TicketBusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketBusPageRoutingModule {}
