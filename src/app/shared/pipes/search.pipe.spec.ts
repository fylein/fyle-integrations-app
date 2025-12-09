import { SearchPipe } from './search.pipe';
import { TranslocoService } from '@jsverse/transloco';

// Mock TranslocoService
const mockTranslocoService = {
  translate: (key: string) => {
    if (key === 'pipes.search.noResultFound') {
      return 'No result found';
    }
    return key;
  },
} as TranslocoService;

xdescribe('SearchPipe', () => {
  it('create an instance', () => {
    const pipe = new SearchPipe(mockTranslocoService);
    expect(pipe).toBeTruthy();
  });

  it('SearchPipe Transform function check 1', () => {
    const names = 'FyleIntegrations';
    const pipe = new SearchPipe(mockTranslocoService);
    expect(pipe.transform(names)).toEqual('FyleIntegrations');
  });

  it('SearchPipe Transform function check 2', () => {
    const value = [
      { value: 'FyleIntegrations' },
      { value: 'Fyle' },
      { value: 'Integrations' },
      { value: 'QBD' },
      { value: 'fyle-integration' },
    ];
    const text1 = 'Fyle';
    const result1 = [{ value: 'FyleIntegrations' }, { value: 'Fyle' }, { value: 'fyle-integration' }];
    const pipe1 = new SearchPipe(mockTranslocoService);
    expect(pipe1.transform(value, text1)).toEqual(result1);
    const names = [
      { name: 'FyleIntegrations' },
      { name: 'Fyle' },
      { name: 'Integrations' },
      { name: 'QBD' },
      { name: 'fyle-integration' },
    ];
    const text2 = 'Fyle';
    const result2 = [{ name: 'FyleIntegrations' }, { name: 'Fyle' }, { name: 'fyle-integration' }];
    const pipe2 = new SearchPipe(mockTranslocoService);
    expect(pipe2.transform(names, text2)).toEqual(result2);
  });

  it('SearchPipe Transform function check 3', () => {
    const names = [
      { value: 'FyleIntegrations' },
      { value: 'Fyle' },
      { value: 'Integrations' },
      { value: 'QBO' },
      { value: 'fyle-integration' },
    ];
    const text = 'NetSuite';
    const result = [{ id: null, value: 'No result found' }];
    const pipe = new SearchPipe(mockTranslocoService);
    expect(pipe.transform(names, text)).toEqual(result);
    const names2 = [
      { name: 'FyleIntegrations' },
      { name: 'Fyle' },
      { name: 'Integrations' },
      { name: 'QBD' },
      { name: 'fyle-integration' },
    ];
    const text2 = 'wFylesw';
    const result2 = [{ email: '', name: 'No result found' }];
    const pipe2 = new SearchPipe(mockTranslocoService);
    expect(pipe2.transform(names2, text2)).toEqual(result2);
  });
});
