import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatinetePageRoutingModule } from './patinete-routing.module';

import { PatinetePage } from './patinete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatinetePageRoutingModule
  ],
  declarations: [PatinetePage]
})
export class PatinetePageModule {}
