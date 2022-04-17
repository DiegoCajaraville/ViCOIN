import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'patinetes',
    redirectTo: 'patinetes',
    pathMatch: 'full'
  },
  {
    path: 'patinete/:id',
    redirectTo: 'patinete',
    pathMatch: 'full'
  },
  {
    path: 'comprarMoneda',
    redirectTo: 'comprarMoneda',
    pathMatch: 'full'
  },
  {
    path: 'patinetes',
    loadChildren: () => import('./patinetes/patinetes.module').then( m => m.PatinetesPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'patinete/:id',
    loadChildren: () => import('./patinete/patinete.module').then( m => m.PatinetePageModule)
  },
  {
    path: 'patineteNoYo/:id',
    loadChildren: () => import('./patinete-alquilado-no-yo/patinete-alquilado-no-yo.module').then( m => m.PatineteAlquiladoNoYoPageModule)
  },
  {
    path: 'comprarMoneda',
    loadChildren: () => import('./comprar-moneda/comprar-moneda.module').then( m => m.ComprarMonedaPageModule)
  },
  {
    path: 'ticket-bus',
    loadChildren: () => import('./ticket-bus/ticket-bus.module').then( m => m.TicketBusPageModule)
  },  
  {
    path: 'patinete-alquilado-no-yo',
    loadChildren: () => import('./patinete-alquilado-no-yo/patinete-alquilado-no-yo.module').then( m => m.PatineteAlquiladoNoYoPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
