import { ClinicianPipe } from './clinicianFilter.pipe';

describe('ClinicianPipe', () => {
  it('create an instance', () => {
    const pipe = new ClinicianPipe();
    expect(pipe).toBeTruthy();
  });
});
