import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {HomeRoutingModule} from "./home-routing.module";

@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    TranslocoRootModule,
  ]
})
export class HomeModule { }
