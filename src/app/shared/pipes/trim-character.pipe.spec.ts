import { TrimCharacterPipe } from './trim-character.pipe';

describe('TrimCharacterPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimCharacterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should trim the string correctly', () => {
    const pipe = new TrimCharacterPipe();
    const trimmedValue = pipe.transform('lll', 1);
    expect(trimmedValue).toBe('l...');
  });

  it('should not trim if trimSize is greater than string length', () => {
    const pipe = new TrimCharacterPipe();
    const value = 'short';
    const trimmedValue = pipe.transform(value, value.length + 1);
    expect(trimmedValue).toBe(value);
  });
});
