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
    path: 'patinetes',
    redirectTo: 'patinetes',
    pathMatch: 'full'
  },
  {
    path: 'patinetes/patinete',
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
    path: 'patinete',
    loadChildren: () => import('./patinete/patinete.module').then( m => m.PatinetePageModule)
  },
  {
    path: 'comprar-moneda',
    loadChildren: () => import('./comprar-moneda/comprar-moneda.module').then( m => m.ComprarMonedaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
