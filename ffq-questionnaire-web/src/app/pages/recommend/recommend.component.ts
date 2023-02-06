import { Component, OnInit } from '@angular/core';
import { ResultsService } from 'src/app/services/results/results.service';
import { FFQResultsResponse } from 'src/app/models/ffqresultsresponse';
import {Observable} from 'rxjs';
import { Description } from 'src/app/models/ffqfooddescription';
import { FoodDescriptionService } from 'src/app/services/food-description/food-description.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recommend-parental',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.css']
})

export class RecommendComponent implements OnInit {

  showBracketFirst = true;
  showBracketSecond = false;
  showBracketThird = false;

  results: Description[] = [];
  show: any = [];
  constructor(public foodDescriptionService: FoodDescriptionService) {}

  ngOnInit() {
    this.getAllResults();
  }

  private getAllResults() {
     const list: Observable<Description[]> = this.foodDescriptionService.getAllFoodItems();
     list.subscribe(m => {
       this.results = m;
     });
  }

  public showFirst() {
    this.showBracketFirst = true;
    this.showBracketSecond = false;
    this.showBracketThird = false;
  }
  public showSecond() {
    this.showBracketFirst = false;
    this.showBracketSecond = true;
    this.showBracketThird = false;
  }
  public showThird() {
    this.showBracketFirst = false;
    this.showBracketSecond = false;
    this.showBracketThird = true;
  }
  editPost(obj, i){
  const index = this.results.findIndex(o => o._id == obj._id);
  if (index != -1) {
    this.show[i] = true;
  }
  }
  updateDescription(res, i){
    this.show[i] = false;
    const list: Observable<Description[]> = this.foodDescriptionService.updateFoodItemDescription(res._id, res);
    list.subscribe(m => {
      this.results = m;
    });
  }
}
