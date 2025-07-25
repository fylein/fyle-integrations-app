import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';


@Pipe({
    name: 'sentenceCase',
    standalone: false
})
export class SentenceCasePipe implements PipeTransform {
  private WORDS_TO_PRESERVE_CASE: string[];

  constructor(private translocoService: TranslocoService) {
    this.WORDS_TO_PRESERVE_CASE = [
      this.translocoService.translate('pipes.sentenceCase.quickbooksOnline'),
      this.translocoService.translate('pipes.sentenceCase.quickbooksDesktop')
    ];
  }

  transform(value: string): string {
    // Ensure the input value is not empty
    if (!value) {
      return '';
    }

    // Convert the entire string to lowercase
    const lowercasedValue = value.toLowerCase();

    // Capitalize the first letter of the first word
    const naiveSentenceCasedValue = lowercasedValue.charAt(0).toUpperCase() + lowercasedValue.slice(1);

    let result = naiveSentenceCasedValue;

    // For all strings in the WORDS_TO_PRESERVE_CASE array, match the case exactly
    for (const word of this.WORDS_TO_PRESERVE_CASE) {
      const pattern = new RegExp(word, 'gi');
      result = result.replace(pattern, word);
    }

    return result;
  }
}
