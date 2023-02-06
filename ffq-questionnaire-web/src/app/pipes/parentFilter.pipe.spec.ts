import { ParentPipe } from './parentFilter.pipe';

describe('ParentPipe', () => {
  it('create an instance', () => {
    const pipe = new ParentPipe();
    expect(pipe).toBeTruthy();
  });
});
