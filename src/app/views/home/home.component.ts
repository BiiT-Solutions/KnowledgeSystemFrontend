import {Component, OnInit} from '@angular/core';
import {FileEntry, FileEntryService} from "knowledge-system-structure-lib";
import {ErrorHandler} from "biit-ui/utils";
import {TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService} from "biit-ui/info";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  files: FileEntry[] = [];
  selectedFile: FileEntry;
  scrollDisabled = false;

  uploadState:
    | 'hover'
    | 'upload'
    | undefined;

  constructor(
    private fileService: FileEntryService,
    private transloco: TranslocoService,
    private snackbar: BiitSnackbarService
  ) {
  }

  ngOnInit() {
    this.fileService.getAll(0, 30).subscribe({
      next: files => {
        this.files.push(...files);
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    });
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
    this.fileService.update(file).subscribe({
      next: value => {
        this.files[this.files.findIndex(item => item.uuid === value.uuid)] = value;
        this.selectedFile = undefined;
      },
      error: err => ErrorHandler.notify(err, this.transloco, this.snackbar)
    })
  }
}
