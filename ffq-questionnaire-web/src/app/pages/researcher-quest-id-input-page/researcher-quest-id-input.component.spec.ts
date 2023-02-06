import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// @ts-ignore
import { QuestIdInputComponent } from './researcher-quest-id-input.component';

describe('QuestIdInputComponent', () => {
  let component: QuestIdInputComponent;
  let fixture: ComponentFixture<QuestIdInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestIdInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestIdInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
