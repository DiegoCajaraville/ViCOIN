import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprarMonedaPage } from './comprar-moneda.page';

const routes: Routes = [
  {
    path: '',
    component: ComprarMonedaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprarMonedaPageRoutingModule {}
