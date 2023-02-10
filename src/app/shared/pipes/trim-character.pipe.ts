import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimCharacter'
})
export class TrimCharacterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
