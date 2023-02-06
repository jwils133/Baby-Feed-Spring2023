import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendParentalComponent } from './recommend-parental.component';

describe('RecommendParentalComponent', () => {
  let component: RecommendParentalComponent;
  let fixture: ComponentFixture<RecommendParentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendParentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendParentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
