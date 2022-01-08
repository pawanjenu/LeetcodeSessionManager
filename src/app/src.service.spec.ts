import { TestBed } from '@angular/core/testing';

import { SrcService } from './src.service';

describe('SrcService', () => {
  let service: SrcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
