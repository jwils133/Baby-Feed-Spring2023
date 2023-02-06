import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicNewUserComponent } from './clinic-new-user.component';

describe('UserComponent', () => {
  let component: ClinicNewUserComponent;
  let fixture: ComponentFixture<ClinicNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
