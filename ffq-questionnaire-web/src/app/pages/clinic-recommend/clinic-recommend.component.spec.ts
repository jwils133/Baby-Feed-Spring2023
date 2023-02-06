import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicRecommendComponent } from './clinic-recommend.component';

describe('ClinicRecommendComponent', () => {
  let component: ClinicRecommendComponent;
  let fixture: ComponentFixture<ClinicRecommendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicRecommendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicRecommendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});