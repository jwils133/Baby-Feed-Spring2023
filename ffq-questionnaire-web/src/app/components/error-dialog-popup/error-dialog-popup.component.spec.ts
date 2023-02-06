import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogPopupComponent } from './error-dialog-popup.component';

describe('ErrorDialogPopupComponent', () => {
  let component: ErrorDialogPopupComponent;
  let fixture: ComponentFixture<ErrorDialogPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorDialogPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
