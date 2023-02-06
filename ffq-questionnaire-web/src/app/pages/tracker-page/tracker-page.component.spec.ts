import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerPageComponent } from './tracker-page.component';

describe('TrackerPageComponent', () => {
  let component: TrackerPageComponent;
  let fixture: ComponentFixture<TrackerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
