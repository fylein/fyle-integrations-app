import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'sentenceCase'
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: string): string {
    // Ensure the input value is not empty
    if (!value) {
return '';
}

    // Convert the entire string to lowercase
    const lowercasedValue = value.toLowerCase();

    // Capitalize the first letter of the first word
    return lowercasedValue.charAt(0).toUpperCase() + lowercasedValue.slice(1);
  }
}
