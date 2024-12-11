import {Component, OnInit} from '@angular/core';
import {
  Categorization,
  CategorizationService,
  FileEntry,
  FileEntryQuery,
  FileEntryService
} from "knowledge-system-structure-lib";
import {ErrorHandler} from "biit-ui/utils";
import {TranslocoService} from "@ngneat/transloco";
import {BiitProgressBarType, BiitSnackbarService} from "biit-ui/info";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {HttpEventType} from "@angular/common/http";
import {DatatableColumn} from "biit-ui/table";
import {BasicUser, BasicUserService} from "user-manager-structure-lib";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  files: FileEntry[] = [];
  categories: Categorization[] = [];
  users: BasicUser[] = [];
  selectedFile: FileEntry;
  scrollDisabled = false;
  loading = false;
  tableView = false;
  query: FileEntryQuery = new FileEntryQuery();

  uploadState:
    | 'hover'
    | 'upload'
    | undefined;

  tableColumns = [
    new DatatableColumn('Name', 'name'),
    new DatatableColumn('Description', 'description'),
    new DatatableColumn('Owner', 'uploadedBy'),
    new DatatableColumn('Upload Date', 'uploadDate'),
    new DatatableColumn('Keywords', 'categorizations'),
  ];

  constructor(
    private fileService: FileEntryService,
    private basicUserService: BasicUserService,
    private categorizationService: CategorizationService,
    private transloco: TranslocoService,
    private snackbar: BiitSnackbarService
  ) {}

  ngOnInit() {
    this.loading = true;
    combineLatest([
      this.fileService.getAll(0, 30),
      this.categorizationService.getAll(),
      this.basicUserService.getAll()
    ]).subscribe({
      next: ([files, categories, users]) => {
        this.files = files.map(FileEntry.clone);
        this.categories = categories.map(Categorization.clone);
        this.users = users.map(BasicUser.clone);
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    }).add(() => this.loading = false);
  }

  openFile(file: FileEntry) {
    if (this.selectedFile && this.selectedFile.uuid == file.uuid) {
      this.selectedFile = undefined;
    } else {
      this.selectedFile = FileEntry.clone(file);
    }
  }

  onDrag(event: any) {
    event.preventDefault();
    console.log(event);
  }

  onDrop(files: NgxFileDropEntry[]) {
    if (files[0].fileEntry.isFile) {
      (files[0].fileEntry as FileSystemFileEntry).file(file => {
        this.uploadState = 'upload';
        this.fileService.upload(file).subscribe({
          next: httpEvent => {
            if (httpEvent.type === HttpEventType.UploadProgress) {
              console.log((100 * httpEvent.loaded) / httpEvent.total);
            }
            if (httpEvent.type === HttpEventType.Response) {
              this.files.unshift(httpEvent.body);
              this.uploadState = undefined;
            }
          },
          error: err => {
            ErrorHandler.notify(err, this.transloco, this.snackbar);
            this.uploadState = undefined;
          }
        });
      });
    } else {
      this.uploadState = undefined;
    }
  }

  onScroll() {
    this.fileService.getAll(this.files.length, 30).subscribe({
      next: files => {
        this.files.push(...files);
        if (!files.length || files.length < 30) {
          this.scrollDisabled = true;
        }
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    });
  }

  onFileUpdate(file: FileEntry): void {
    this.loading = true;

    this.fileService.update(file).subscribe({
      next: value => {
        this.files[this.files.findIndex(item => item.uuid === value.uuid)] = value;
        this.selectedFile = undefined;
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    }).add(() => this.loading = false);
  }

  protected readonly BiitProgressBarType = BiitProgressBarType;
}
