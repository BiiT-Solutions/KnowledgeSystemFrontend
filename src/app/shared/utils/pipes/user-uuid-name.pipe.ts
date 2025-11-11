import { Pipe, PipeTransform } from '@angular/core';
import {BasicUser} from "@biit-solutions/user-manager-structure";

@Pipe({
  name: 'userUuidName',
  standalone: true
})
export class UserUuidNamePipe implements PipeTransform {
  transform(uuid: string, users: BasicUser[]): string {
    if (uuid && users?.length) {
      const user = users.find(u => u.uuid == uuid);
      let string = '';
      if (user.name) string += user.name;
      if (user.lastname) string += ` ${user.lastname}`;

      return string;
    }

    return '';
  }
}
