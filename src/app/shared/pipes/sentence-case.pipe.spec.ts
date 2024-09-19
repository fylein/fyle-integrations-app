import { SentenceCasePipe } from './sentence-case.pipe';

xdescribe('SentenceCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SentenceCasePipe();
    expect(pipe).toBeTruthy();
  });
});
