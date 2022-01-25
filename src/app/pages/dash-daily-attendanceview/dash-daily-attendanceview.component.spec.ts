import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDailyAttendanceviewComponent } from './dash-daily-attendanceview.component';

describe('DashDailyAttendanceviewComponent', () => {
  let component: DashDailyAttendanceviewComponent;
  let fixture: ComponentFixture<DashDailyAttendanceviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashDailyAttendanceviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashDailyAttendanceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
