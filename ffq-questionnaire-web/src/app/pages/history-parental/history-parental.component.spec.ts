import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryParentalComponent } from './history-parental.component';

describe('HistoryParentalComponent', () => {
  let component: HistoryParentalComponent;
  let fixture: ComponentFixture<HistoryParentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryParentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryParentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
