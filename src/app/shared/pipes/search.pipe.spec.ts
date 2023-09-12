import { SearchPipe } from './search.pipe';

describe('SearchPipe', () => {
  it('create an instance', () => {
    const pipe = new SearchPipe();
    expect(pipe).toBeTruthy();
  });

  it('SearchPipe Transform function check 1', () => {
    const names = 'FyleIntegrations';
    const pipe = new SearchPipe();
    expect(pipe.transform(names)).toEqual('FyleIntegrations');
  });

  it('SearchPipe Transform function check 2', () => {
    const names = [{value: 'FyleIntegrations'}, {value: 'Fyle'}, {value: 'Integrations'}, {value: 'QBO'}, {value: 'fyle-integration'}];
    const text = "Fyle";
    const result = [{value: 'FyleIntegrations'}, {value: 'Fyle'}, {value: 'fyle-integration'}];
    const pipe = new SearchPipe();
    expect(pipe.transform(names, text)).toEqual(result);
  });

  it('SearchPipe Transform function check 3', () => {
    const names = [{value: 'FyleIntegrations'}, {value: 'Fyle'}, {value: 'Integrations'}, {value: 'QBO'}, {value: 'fyle-integration'}];
    const text = "Netsuite";
    const result = [{ id: null, value: 'No result found' }];
    const pipe = new SearchPipe();
    expect(pipe.transform(names, text)).toEqual(result);
  });
});
