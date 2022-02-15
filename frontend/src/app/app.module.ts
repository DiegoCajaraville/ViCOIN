import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
 
// Google Maps de Angular 9 
import {GoogleMapsModule} from '@angular/google-maps'; 
 
import { AppComponent } from './app.component';
 
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, GoogleMapsModule,],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

