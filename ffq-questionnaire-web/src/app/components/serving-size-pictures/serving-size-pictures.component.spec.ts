import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServingSizePicturesComponent } from "./serving-size-pictures.component";

describe("ServingSizePicturesComponent", () => {
  let component: ServingSizePicturesComponent;
  let fixture: ComponentFixture<ServingSizePicturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServingSizePicturesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServingSizePicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
