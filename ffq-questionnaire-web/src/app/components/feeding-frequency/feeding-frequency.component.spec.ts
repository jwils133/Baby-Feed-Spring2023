import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FeedingFrequencyComponent } from "./feeding-frequency.component";

describe("FeedingFrequencyComponent", () => {
  let component: FeedingFrequencyComponent;
  let fixture: ComponentFixture<FeedingFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedingFrequencyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
