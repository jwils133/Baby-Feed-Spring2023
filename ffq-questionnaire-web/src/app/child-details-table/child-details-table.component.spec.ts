import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDetailsTableComponent } from './child-details-table.component';

describe('ChildDetailsTableComponent', () => {
  let component: ChildDetailsTableComponent;
  let fixture: ComponentFixture<ChildDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildDetailsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
