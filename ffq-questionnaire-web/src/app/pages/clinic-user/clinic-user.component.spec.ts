import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicUserComponent } from './clinic-user.component';

describe('ClinicUserComponent', () => {
  let component: ClinicUserComponent;
  let fixture: ComponentFixture<ClinicUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});