import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {GoogleMapsModule} from '@angular/google-maps';

import { IonicModule } from '@ionic/angular';

import { PatinetesPageRoutingModule } from './patinetes-routing.module';

import { PatinetesPage } from './patinetes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    PatinetesPageRoutingModule
  ],
  declarations: [PatinetesPage]
})
export class PatinetesPageModule {}
