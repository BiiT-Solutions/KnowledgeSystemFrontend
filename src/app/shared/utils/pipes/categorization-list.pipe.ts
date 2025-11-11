import { Pipe, PipeTransform } from '@angular/core';
import {Categorization} from "@biit-solutions/knowledge-system-structure";

@Pipe({
  name: 'categorizationList',
  standalone: true
})
export class CategorizationListPipe implements PipeTransform {
  transform(categorizations: Categorization[]): string {
    if (categorizations && categorizations.length) {
      let string = '';

      categorizations.forEach((category, index) => {
        if (index > 0) string += ', ';
        string += category.name;
      });

      return string;
    }

    return '';
  }
}
