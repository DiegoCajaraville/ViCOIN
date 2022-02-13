import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatinetePage } from './patinete.page';

const routes: Routes = [
  {
    path: '',
    component: PatinetePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatinetePageRoutingModule {}
