import { SnakeCaseToSpaceCasePipe } from './snake-case-to-space-case.pipe';

describe('SnakeCaseToSpaceCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeCaseToSpaceCasePipe();
    expect(pipe).toBeTruthy();
  });

  it('SnakeCaseToSpaceCasePipe Transform function check', () => {
    const name = 'CORPORATE_CARD';
    const pipe = new SnakeCaseToSpaceCasePipe();
    expect(pipe.transform(name)).toEqual('CORPORATE CARD');
  });

  it('SnakeCaseToSpaceCasePipe Transform function check 2', () => {
    const name = 22;
    const pipe = new SnakeCaseToSpaceCasePipe();
    expect(pipe.transform(name)).toEqual('');
  });
});
