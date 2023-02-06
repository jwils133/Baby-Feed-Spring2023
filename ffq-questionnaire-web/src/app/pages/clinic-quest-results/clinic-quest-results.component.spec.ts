import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { ClinicQuestResultsComponent } from './clinic-quest-results.component';

describe('ClinicQuestResultsComponent', () => {
  let component: ClinicQuestResultsComponent;
  let fixture: ComponentFixture<ClinicQuestResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicQuestResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicQuestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
