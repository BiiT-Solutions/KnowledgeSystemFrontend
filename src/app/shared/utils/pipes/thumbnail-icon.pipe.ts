import { Pipe, PipeTransform } from '@angular/core';
import {FileEntry} from "knowledge-system-structure-lib";
import {FileFormat} from "../types/file-format";
import {
  biitIcon,
  biitIconFileAudio,
  biitIconFileBin,
  biitIconFileDoc,
  biitIconFilePdf, biitIconFilePpt,
  biitIconFileTxt, biitIconFileUnknown, biitIconFileVideo, biitIconFileXls, biitIconFileZip
} from "biit-icons-collection";

@Pipe({
  name: 'thumbnailIcon',
  standalone: true
})
export class ThumbnailIconPipe implements PipeTransform {
  transform(filename: string): biitIcon {
    if (!filename)
      return undefined;

    if (FileFormat.audio.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileAudio.name;
    if (FileFormat.bin.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileBin.name;
    if (FileFormat.doc.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileDoc.name;
    if (FileFormat.pdf.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFilePdf.name;
    if (FileFormat.ppt.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFilePpt.name;
    if (FileFormat.txt.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileTxt.name;
    if (FileFormat.video.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileVideo.name;
    if (FileFormat.xls.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileXls.name;
    if (FileFormat.zip.includes(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()))
      return biitIconFileZip.name;

    return biitIconFileUnknown.name;
  }

}
