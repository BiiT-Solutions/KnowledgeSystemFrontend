import {AfterViewInit, Component, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {
  Categorization,
  CategorizationService,
  FileEntry,
  FileEntryQuery,
  FileEntryService
} from "@biit-solutions/knowledge-system-structure";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {BiitProgressBarType, BiitSnackbarService} from "@biit-solutions/wizardry-theme/info";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {HttpEventType} from "@angular/common/http";
import {DatatableColumn, Page} from "@biit-solutions/wizardry-theme/table";
import {BasicUser, BasicUserService} from "@biit-solutions/user-manager-structure";
import {combineLatest} from "rxjs";
import {CategorizationListPipe} from "../../shared/utils/pipes/categorization-list.pipe";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 't'}), DatePipe]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren('dateCell') dateCell: QueryList<TemplateRef<any>>;
  @ViewChildren('userCell') userCell: QueryList<TemplateRef<any>>;

  files: FileEntry[] = [];
  categories: Categorization[] = [];
  users: BasicUser[] = [];
  selectedFile: FileEntry;
  scrollDisabled = false;
  loading = false;

  uploadState:
    | 'hover'
    | 'upload'
    | undefined;

  tableView = false;
  tableColumns: DatatableColumn[];
  page: Page = new Page(0, 10, 0);
  query: FileEntryQuery = new FileEntryQuery();

  protected readonly BiitProgressBarType = BiitProgressBarType;

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
      next: ([fileResponse, categories, users]) => {
        this.files = fileResponse.files.map(FileEntry.clone);
        this.categories = categories.map(Categorization.clone);
        this.users = users.map(BasicUser.clone);
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    }).add(() => this.loading = false);
  }

  ngAfterViewInit() {
    this.tableColumns = [
      new DatatableColumn('Name', 'name'),
      new DatatableColumn('Description', 'description'),
      new DatatableColumn('Owner', 'createdBy', true, undefined, false, undefined, this.userCell.first),
      new DatatableColumn('Upload Date', 'createdAt', true, undefined, false, undefined, this.dateCell.first),
      new DatatableColumn('Keywords', 'categorizations', true, undefined, false, new CategorizationListPipe()),
    ];
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
              if (this.tableView) {
                this.fileService.getAll(this.page.pageNumber * this.page.pageSize, this.page.pageSize).subscribe({
                  next: response => {
                    this.files = response.files.map(FileEntry.clone);
                    this.page.totalElements = response.total;
                  },
                  error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
                });
              } else {
                this.files.unshift(httpEvent.body);
              }
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
      next: response => {
        this.files.push(...response.files);
        if (!response.files.length || response.files.length < 30) {
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

  changeView(tableView: boolean) {
    if (tableView !== this.tableView) {
      this.loading = true;
      this.tableView = tableView;
      this.files = [];
      this.page.pageNumber = 0;

      this.fileService.getAll(0, this.tableView ? this.page.pageSize : 30).subscribe({
        next: response => {
          console.log(response)
          this.files = response.files.map(FileEntry.clone);
          this.page.totalElements = response.total;
        },
        error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
      }).add(() => this.loading = false);
    }
  }

  onTablePageChange(newPage: Page) {
    this.page = newPage;

    this.fileService.getAll(this.page.pageNumber * this.page.pageSize, this.page.pageSize).subscribe({
      next: response => {
        this.files = response.files.map(FileEntry.clone);
        this.page.totalElements = response.total;
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    });
  }
}
