/*

  Added by Javier Romero, edited by Khalid Alamoudi
  This is the recommendations page for the clinician portal (clinic/recommend).
  From here, the clinician can see all the recommended nutrients for all parents assigned to the clinic.

*/
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Description } from "src/app/models/ffqfooddescription";
import { FoodDescriptionService } from "src/app/services/food-description/food-description.service";

@Component({
  selector: "app-recommend",
  templateUrl: "./clinic-recommend.component.html",
  styleUrls: ["./clinic-recommend.component.css"],
})
export class ClinicRecommendComponent implements OnInit {
  showBracketFirst = false;
  showBracketSecond = false;
  showBracketThird = false;
  showNone = true;

  ageMessage = "Please select infant age.";
  ageRange1: string = "for child 0 to 5.9 months";
  ageRange2: string = "for child 6 to 11.9 months";
  ageRange3: string = "for child 12 to 24 months";

  results: Description[] = [];

  constructor(public foodDescriptionService: FoodDescriptionService) {}

  ngOnInit() {
    this.getAllResults();
  }

  private getAllResults() {
    const list: Observable<
      Description[]
    > = this.foodDescriptionService.getAllFoodItems();
    list.subscribe((m) => {
      this.results = m;
    });
  }

  public showFirst() {
    this.showBracketFirst = true;
    this.showBracketSecond = false;
    this.showBracketThird = false;
    this.ageMessage = this.ageRange1;
    this.showNone = false;
  }
  public showSecond() {
    this.showBracketFirst = false;
    this.showBracketSecond = true;
    this.showBracketThird = false;
    this.ageMessage = this.ageRange2;
    this.showNone = false;
  }
  public showThird() {
    this.showBracketFirst = false;
    this.showBracketSecond = false;
    this.showBracketThird = true;
    this.ageMessage = this.ageRange3;
    this.showNone = false;
  }
}
