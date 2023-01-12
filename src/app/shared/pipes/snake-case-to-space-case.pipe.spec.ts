import { SnakeCaseToSpaceCasePipe } from './snake-case-to-space-case.pipe';

describe('SnakeCaseToSpaceCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeCaseToSpaceCasePipe();
    expect(pipe).toBeTruthy();
  });
});
