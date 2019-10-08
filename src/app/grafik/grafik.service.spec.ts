import { TestBed } from '@angular/core/testing';

import { GrafikService } from './grafik.service';

describe('GrafikService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrafikService = TestBed.get(GrafikService);
    expect(service).toBeTruthy();
  });
});
