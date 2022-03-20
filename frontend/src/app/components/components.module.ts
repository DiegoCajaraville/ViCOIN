import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { PopoverComponent } from './popover/popover.component'

@NgModule({
  declarations: [MenuComponent, PopoverComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MenuComponent,
    PopoverComponent
  ],
})
export class ComponentsModule { }
