import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";

const login = import('./views/biit-login-page/biit-login-page.module').then(m => m.BiitLoginPageModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => login
  },
  {
    path: 'login',
    loadChildren: () => login
  },
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => login
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
