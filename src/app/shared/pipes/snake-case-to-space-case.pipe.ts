import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseToSpaceCase'
})
export class SnakeCaseToSpaceCasePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
