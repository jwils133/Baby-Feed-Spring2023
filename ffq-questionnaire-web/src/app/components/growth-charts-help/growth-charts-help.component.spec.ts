import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthChartsHelpComponent } from './growth-charts-help.component';

describe('GrowthChartsHelpComponent', () => {
  let component: GrowthChartsHelpComponent;
  let fixture: ComponentFixture<GrowthChartsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowthChartsHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthChartsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
