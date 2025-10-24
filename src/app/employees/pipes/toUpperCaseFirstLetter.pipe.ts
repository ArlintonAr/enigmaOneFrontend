import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'toUpperCaseFirstLetter',
})
export class ToUpperCaseFirstLetterPipe implements PipeTransform {

  transform(value: string | null | undefined): string | null | undefined {
    if(!value) return '';
    return value.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ')
  }

}
