import {Component, Input} from '@angular/core';
import {CalorieRow, FFQResult, NutrientRow} from '../../models/FFQResult';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent {

  @Input() results: FFQResult;

  constructor(public activeModal: NgbActiveModal) { }

  getNutrientRowsList() {
    const rows: NutrientRow[] = [];
    const nutrients = this.getNutrientNamesInOrder();
    for (const key of nutrients) {
      rows.push(this.results.getNutrientRowForKey(key));
    }
    return rows;
  }

  getNutrientNamesInOrder() {
    const list: string[] = [];
    this.results.dailyAverages.forEach((value: number, key: string) => {
      list.push(key);
    });
    //Commented code below because it serves no purpose
    /*list.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });*/
    return list;
  }

  getCaloricRow(): CalorieRow {
    return this.results.getCaloricRow();
  }
}
