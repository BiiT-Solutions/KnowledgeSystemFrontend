import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {HomeRoutingModule} from "./home-routing.module";
import {BiitDatePickerModule, BiitInputTextModule, BiitMultiselectModule, BiitToggleGroupModule} from "biit-ui/inputs";
import {BiitIconButtonModule} from "biit-ui/button";
import {FormsModule} from "@angular/forms";
import {FileDetailComponent} from "../../shared/components/file-detail/file-detail.component";
import {BiitPopupModule} from "biit-ui/popup";
import {NgxFileDropModule} from "ngx-file-drop";
import {FilePreviewComponent} from "../../shared/components/file-preview/file-preview.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {BiitProgressBarModule} from "biit-ui/info";
import {BiitDatatableModule} from "biit-ui/table";
import {UserUuidNamePipe} from "../../shared/utils/pipes/user-uuid-name.pipe";

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
    BiitInputTextModule,
    BiitIconButtonModule,
    FormsModule,
    FileDetailComponent,
    BiitPopupModule,
    NgxFileDropModule,
    FilePreviewComponent,
    InfiniteScrollModule,
    BiitProgressBarModule,
    BiitMultiselectModule,
    BiitDatePickerModule,
    BiitToggleGroupModule,
    BiitDatatableModule,
    UserUuidNamePipe,
  ]
})
export class HomeModule { }
