import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooditemComponent } from './fooditem.component';

describe('FooditemComponent', () => {
  let component: FooditemComponent;
  let fixture: ComponentFixture<FooditemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooditemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooditemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
