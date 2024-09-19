import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'trimCharacter'
})
export class TrimCharacterPipe implements PipeTransform {

  transform(value: string, trimSize: number): string {
    if (value.length > trimSize) {
      return `${value.substring(0, trimSize)}...`;
    }

    return value;
  }

}
