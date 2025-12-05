import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
    name: 'search',
    standalone: false
})
export class SearchPipe implements PipeTransform {

  constructor(private translocoService: TranslocoService) {}

  transform(value: any, ...args: any[]): any {
    if (value && args && args.length && args[0]) {
      const searchText = args[0].toLowerCase();
      const options = value.filter((item: any) => {
        return item.value ? item.value.toLowerCase().includes(searchText) : item.name.toLowerCase().includes(searchText);
      });
      return options && options.length ? options : (value[0].value ? [{ id: null, value: this.translocoService.translate('pipes.search.noResultFound') }] : [{ email: '', name: this.translocoService.translate('pipes.search.noResultFound') }]);
    }
    return value;
  }

}
