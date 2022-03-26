import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatineteAlquiladoYoPage } from './patinete-alquilado-yo.page';

const routes: Routes = [
  {
    path: '',
    component: PatineteAlquiladoYoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatineteAlquiladoYoPageRoutingModule {}
