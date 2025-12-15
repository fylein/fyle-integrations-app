import { Pipe, PipeTransform } from '@angular/core';
import { FormArray } from '@angular/forms';

@Pipe({
    name: 'excludeSelectedOptions',
    pure: false,
    standalone: false
})
export class ExcludeSelectedOptionsPipe implements PipeTransform {

  transform(
    options: any[],
    formArray: FormArray | null,
    currentIndex: number,
    fieldName: string
  ): any[] {

    if (!options || !formArray || !fieldName) {
      return options || [];
    }

    const selectedValues = formArray.controls
      .map((control, index) => (index !== currentIndex ? control.get(fieldName)?.value : null))
      .filter(value => value !== null && value !== undefined && value !== '');

    return options.filter(option =>
      !selectedValues.includes(option.attribute_type)
    );
  }
}