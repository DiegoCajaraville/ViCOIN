import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { PopupComponent } from './popup/popup.component'

@NgModule({
  declarations: [MenuComponent, PopupComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MenuComponent,
    PopupComponent
  ],
})
export class ComponentsModule { }
