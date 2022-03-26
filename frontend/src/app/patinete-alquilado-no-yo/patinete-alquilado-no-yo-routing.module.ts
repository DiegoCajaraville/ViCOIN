import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatineteAlquiladoNoYoPage } from './patinete-alquilado-no-yo.page';

const routes: Routes = [
  {
    path: '',
    component: PatineteAlquiladoNoYoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatineteAlquiladoNoYoPageRoutingModule {}
