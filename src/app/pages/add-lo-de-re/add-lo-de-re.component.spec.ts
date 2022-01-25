import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoDeReComponent } from './add-lo-de-re.component';

describe('AddLoDeReComponent', () => {
  let component: AddLoDeReComponent;
  let fixture: ComponentFixture<AddLoDeReComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoDeReComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoDeReComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
