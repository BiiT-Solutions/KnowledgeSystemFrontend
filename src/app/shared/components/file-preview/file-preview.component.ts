import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BiitInputTextModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {FileEntry, KnowledgeSystemRootService} from "@biit-solutions/knowledge-system-structure"
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {ThumbnailIconPipe} from "../../utils/pipes/thumbnail-icon.pipe";
import {BiitTooltipModule} from "@biit-solutions/wizardry-theme/info";

@Component({
  selector: 'file-preview',
  standalone: true,
  imports: [CommonModule, BiitInputTextModule, FormsModule, BiitIconModule, ThumbnailIconPipe, BiitTooltipModule],
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent {
  @Input() file: FileEntry;
  @Input() selected = false;
  @Output() onClick: EventEmitter<FileEntry> = new EventEmitter<FileEntry>();

  constructor(protected knowledgeSystemRootService: KnowledgeSystemRootService) {}
}
