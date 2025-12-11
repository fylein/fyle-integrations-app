import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trimCharacter',
    standalone: false
})
export class TrimCharacterPipe implements PipeTransform {

  transform(value: string, trimSize: number): string {
    if (value.length > trimSize) {
      return `${value.substring(0, trimSize)}...`;
    }

    return value;
  }

}
