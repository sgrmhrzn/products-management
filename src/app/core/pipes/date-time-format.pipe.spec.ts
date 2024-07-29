import { DateTimeFormatPipe } from './date-time-format.pipe';

describe('DateTimeFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new DateTimeFormatPipe();
    expect(pipe).toBeTruthy();
  });

  it('date format', () => {
    const pipe = new DateTimeFormatPipe();
    expect(pipe.transform(new Date())).toEqual('2024-05-07');
  });
});
