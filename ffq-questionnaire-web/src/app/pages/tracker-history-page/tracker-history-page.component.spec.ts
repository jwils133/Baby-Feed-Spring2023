import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerHistoryPageComponent } from './tracker-history-page.component';

describe('TrackerHistoryPageComponent', () => {
  let component: TrackerHistoryPageComponent;
  let fixture: ComponentFixture<TrackerHistoryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerHistoryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
