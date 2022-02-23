import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { PatinetesPageRoutingModule } from './patinetes-routing.module';

import { PatinetesPage } from './patinetes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatinetesPageRoutingModule
  ],
  declarations: [PatinetesPage]
})
export class PatinetesPageModule {}
