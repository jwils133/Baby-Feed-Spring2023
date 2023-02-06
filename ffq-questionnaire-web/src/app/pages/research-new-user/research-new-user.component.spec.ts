import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchNewUserComponent } from './research-new-user.component';

describe('UserComponent', () => {
  let component: ResearchNewUserComponent;
  let fixture: ComponentFixture<ResearchNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
