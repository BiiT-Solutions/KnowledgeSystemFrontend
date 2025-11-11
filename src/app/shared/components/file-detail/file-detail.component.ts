import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {
  BiitDatePickerModule,
  BiitInputTextModule,
  BiitMultiselectModule, BiitMultiselectType,
  BiitTextareaModule,
  BiitToggleModule
} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {
  Categorization,
  CategorizationService,
  FileEntry,
  KnowledgeSystemRootService
} from "@biit-solutions/knowledge-system-structure"
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";
import {provideTranslocoScope, TranslocoModule, TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService, BiitTooltipModule} from "@biit-solutions/wizardry-theme/info";
import {ThumbnailUrlPipe} from "../../utils/pipes/thumbnail-url.pipe";
import {ThumbnailIconPipe} from "../../utils/pipes/thumbnail-icon.pipe";
import {HttpErrorResponse} from "@angular/common/http";
import {Environment} from "../../../../environments/environment";

@Component({
  selector: 'file-detail',
  standalone: true,
  imports: [CommonModule, BiitInputTextModule, FormsModule, BiitIconButtonModule, BiitIconModule, BiitTextareaModule, BiitToggleModule, BiitDatePickerModule, BiitMultiselectModule, BiitButtonModule, TranslocoModule, ThumbnailIconPipe, ThumbnailIconPipe, ThumbnailUrlPipe, BiitTooltipModule],
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

  onAddCategory(category: Categorization) {
    // const tempCat = (category as Categorization).name ? this.categories.find(c => c.name == c.name) : undefined;
    //
    // if (tempCat) {
    //   this._file.categorizations.push(tempCat);
    // } else {
    //   this.categorizationService.createByName(category as string).subscribe({
    //     next: value => {
    //       this._file.categorizations.push(value);
    //     },
    //     error: err => ErrorHandler.notify(err, this.transloco, this.snackbarService)
    //   });
    // }
  }

  onNewCategory(category: string) {
    const catExists = !this._file.categorizations.some(c => c.name.toLowerCase() == category.toLowerCase()) && this.categories.find(c => c.name.toLowerCase() == category.toLowerCase());

    if (catExists) {
      this._file.categorizations.push(catExists);
    } else {
      this.categorizationService.find(category).subscribe({
        next: foundCat => {
          this._file.categorizations.push(foundCat)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 404) {
            this.categorizationService.createByName(category).subscribe({
              next: newCat => {
                this.categories.push(newCat);
                this._file.categorizations.push(newCat);
              },
              error: err =>  ErrorHandler.notify(err, this.transloco, this.snackbarService)
            });
          } else {
            ErrorHandler.notify(err, this.transloco, this.snackbarService);
          }
        }
      });
    }
  }

  update(): void {
    this.onUpdate.emit(this._file);
  }

  log(event: any) {
    console.log('DEVELOPMENT LOG', event);
  }

  protected readonly Environment = Environment;
}
