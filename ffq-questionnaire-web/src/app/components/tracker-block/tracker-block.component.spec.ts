import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerBlockComponent } from './tracker-block.component';

describe('TrackerBlockComponent', () => {
  let component: TrackerBlockComponent;
  let fixture: ComponentFixture<TrackerBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
