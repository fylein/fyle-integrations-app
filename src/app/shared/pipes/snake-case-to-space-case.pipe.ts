import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'snakeCaseToSpaceCase',
    standalone: false
})
export class SnakeCaseToSpaceCasePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value && typeof value === 'string') {
      return value.replace(/_/g, ' ');
    }

    return '';
  }

}
