import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatinetesPage } from './patinetes.page';

const routes: Routes = [
  {
    path: '',
    component: PatinetesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatinetesPageRoutingModule {}
