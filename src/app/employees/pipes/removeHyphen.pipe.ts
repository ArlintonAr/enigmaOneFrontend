import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHyphen',
})
export class RemoveHyphenPipe implements PipeTransform {

  transform(value: string | undefined): string {

    if(!value)return ''
    const arrayValue = value.split('_')
    const newValue = arrayValue.join(' ')
    return newValue.toLocaleLowerCase();
  }

}
