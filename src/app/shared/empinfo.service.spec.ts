import { TestBed } from '@angular/core/testing';

import { EmpinfoService } from './empinfo.service';

describe('EmpinfoService', () => {
  let service: EmpinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
