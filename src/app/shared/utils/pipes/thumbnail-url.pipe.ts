import { Pipe, PipeTransform } from '@angular/core';
import {FileEntry, KnowledgeSystemRootService} from "@biit-solutions/knowledge-system-structure";
import {FileFormat} from "../types/file-format";
import {
  biitIcon,
  biitIconFileAudio,
  biitIconFileBin,
  biitIconFileDoc,
  biitIconFilePdf, biitIconFilePpt,
  biitIconFileTxt, biitIconFileUnknown, biitIconFileVideo, biitIconFileXls, biitIconFileZip
} from "@biit-solutions/biit-icons-collection";

@Pipe({
  name: 'thumbnailUrl',
  standalone: true
})
export class ThumbnailUrlPipe implements PipeTransform {
  constructor(private knowledgeSystemRootService: KnowledgeSystemRootService) {}

  transform(thumbnailUrl: string): string {
    if (!thumbnailUrl)
      return undefined;

    return this.knowledgeSystemRootService.serverUrl + thumbnailUrl;
  }

}
