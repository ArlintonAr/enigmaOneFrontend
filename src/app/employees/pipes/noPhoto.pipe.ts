import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'noPhoto',
})
export class NoPhotoPipe implements PipeTransform {

  transform(value: string | null | undefined |'' ) {
  if(value==null || value==undefined || value==='' ){
    return '/sin-foto.png'
  }
    return value;
  }

}
