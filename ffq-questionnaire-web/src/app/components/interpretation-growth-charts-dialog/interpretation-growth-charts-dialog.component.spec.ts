import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InterpretationGrowthChartsDialogComponent } from "./interpretation-growth-charts-dialog.component";

describe("InterpretationGrowthChartsDialogComponent", () => {
  let component: InterpretationGrowthChartsDialogComponent;
  let fixture: ComponentFixture<InterpretationGrowthChartsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterpretationGrowthChartsDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      InterpretationGrowthChartsDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
