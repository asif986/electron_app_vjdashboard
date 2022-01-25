import { TestBed } from '@angular/core/testing';

import { AttendancereportService } from './attendancereport.service';

describe('AttendancereportService', () => {
  let service: AttendancereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendancereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
