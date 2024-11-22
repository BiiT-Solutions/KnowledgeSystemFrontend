import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {
  BiitDatePickerModule,
  BiitInputTextModule,
  BiitMultiselectModule, BiitMultiselectType,
  BiitTextareaModule,
  BiitToggleModule
} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {
  Categorization,
  CategorizationService,
  FileEntry,
  KnowledgeSystemRootService
} from "knowledge-system-structure-lib"
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitIconModule} from "biit-ui/icon";
import {ErrorHandler} from "biit-ui/utils";
import {provideTranslocoScope, TranslocoModule, TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService} from "biit-ui/info";
import {ThumbnailUrlPipe} from "../../utils/pipes/thumbnail-url.pipe";
import {ThumbnailIconPipe} from "../../utils/pipes/thumbnail-icon.pipe";

@Component({
  selector: 'file-detail',
  standalone: true,
  imports: [CommonModule, BiitInputTextModule, FormsModule, BiitIconButtonModule, BiitIconModule, BiitTextareaModule, BiitToggleModule, BiitDatePickerModule, BiitMultiselectModule, BiitButtonModule, TranslocoModule, ThumbnailIconPipe, ThumbnailIconPipe, ThumbnailUrlPipe],
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 't'}), DatePipe]
})
export class FileDetailComponent implements OnInit {
  @Input() set file(file: FileEntry | undefined) {
    if (file) {
      this._file = file;
    } else {
      setTimeout(() => this._file = undefined, 1000);
    }
  }
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onUpdate: EventEmitter<FileEntry> = new EventEmitter<FileEntry>();
  _file: FileEntry | undefined;
  categories: Categorization[] = [];

  protected readonly BiitMultiselectType = BiitMultiselectType;

  constructor(
    protected knowledgeSystemRootService: KnowledgeSystemRootService,
    private categorizationService: CategorizationService,
    private transloco: TranslocoService,
    private snackbarService: BiitSnackbarService
    ) {}

  ngOnInit() {
    this.categorizationService.getAll().subscribe({
      next: categories => {
        this.categories = categories.map(Categorization.clone);
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbarService)
    });
  }

  reloadCategories() {
    if (!this._file) {
      this.categorizationService.getAll().subscribe({
        next: categories => {
          this.categories = categories.map(Categorization.clone);
        },
        error: err => ErrorHandler.notify(err, this.transloco, this.snackbarService)
      });
    }
  }

  searchCategories(query: string) {
    this.categorizationService.search(query).subscribe({
      next: categories => {
        this.categories = this._file.categorizations.concat(categories.filter(c => this._file.categorizations.find(d => d.uuid === c.uuid)));
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbarService)
    });
  }

  update(): void {
    this.onUpdate.emit(this._file);
  }

  log(event: any) {
    console.log('DEVELOPMENT LOG', event);
  }
}
