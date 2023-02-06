import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestResultsComponent } from './quest-results.component';

describe('QuestResultsComponent', () => {
  let component: QuestResultsComponent;
  let fixture: ComponentFixture<QuestResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
