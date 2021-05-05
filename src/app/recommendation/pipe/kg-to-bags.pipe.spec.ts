import { KgToBagsPipe } from './kg-to-bags.pipe';

describe('KgToBagsPipe', () => {
  it('create an instance', () => {
    const pipe = new KgToBagsPipe();
    expect(pipe).toBeTruthy();
  });

  it('default value instead of 0kg for null values', () => {
    const pipe = new KgToBagsPipe();
    const result = pipe.transform(null, '---');
    expect(result).toBe('---');
  });

  it('default value instead of 0kg for 0 values', () => {
    const pipe = new KgToBagsPipe();
    const result = pipe.transform(0, '---');
    expect(result).toBe('---');
  });

  it('no 0kg label for whole values divisible by 50', () => {
    const pipe = new KgToBagsPipe();
    const result = pipe.transform(150, '---');
    expect(result).toBe('3 bags');
  });

});
