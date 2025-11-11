import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {HomeRoutingModule} from "./home-routing.module";
import {BiitDatePickerModule, BiitInputTextModule, BiitMultiselectModule, BiitToggleGroupModule} from "@biit-solutions/wizardry-theme/inputs";
import {BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {FormsModule} from "@angular/forms";
import {FileDetailComponent} from "../../shared/components/file-detail/file-detail.component";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {NgxFileDropModule} from "ngx-file-drop";
import {FilePreviewComponent} from "../../shared/components/file-preview/file-preview.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
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
