import { SentenceCasePipe } from './sentence-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

// Mock TranslocoService
const mockTranslocoService = {
  translate: (key: string) => {
    if (key === 'pipes.sentenceCase.quickbooksOnline') {
      return 'QuickBooks Online';
    }
    if (key === 'pipes.sentenceCase.quickbooksDesktop') {
      return 'QuickBooks Desktop';
    }
    return key;
  }
} as TranslocoService;

describe('SentenceCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SentenceCasePipe(mockTranslocoService);
    expect(pipe).toBeTruthy();
  });
});
