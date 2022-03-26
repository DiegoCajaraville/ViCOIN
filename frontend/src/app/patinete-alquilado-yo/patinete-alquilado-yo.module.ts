import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatineteAlquiladoYoPageRoutingModule } from './patinete-alquilado-yo-routing.module';

import { PatineteAlquiladoYoPage } from './patinete-alquilado-yo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatineteAlquiladoYoPageRoutingModule
  ],
  declarations: [PatineteAlquiladoYoPage]
})
export class PatineteAlquiladoYoPageModule {}
