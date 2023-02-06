import {NutrientConstants} from './NutrientConstants';

export class FFQResult {
  static readonly CAL_TOT = 'Energy (kcal)';
  static readonly CAL_PERC_CARB = '% Calories from Carbs';
  static readonly CAL_PERC_FAT = '% Calories from Fat';
  static readonly CAL_PERC_PROT = '% Calories from Protein';

  dailyAverages: Map<string, number>;
  weeklyTotals: Map<string, number>;
  calorieSummary: Map<string, number>;

  constructor(dailyAverages: Map<string, number>, weeklyTotals: Map<string, number>) {
    this.dailyAverages = dailyAverages;
    this.dailyAverages.delete(FFQResult.CAL_PERC_CARB);
    this.dailyAverages.delete(FFQResult.CAL_PERC_FAT);
    this.dailyAverages.delete(FFQResult.CAL_PERC_PROT);

    this.weeklyTotals = weeklyTotals;
    this.calorieSummary = new Map();
    this.calorieSummary.set(FFQResult.CAL_TOT, this.weeklyTotals.get(FFQResult.CAL_TOT));
    this.calorieSummary.set(FFQResult.CAL_PERC_PROT, this.weeklyTotals.get(FFQResult.CAL_PERC_PROT));
    this.calorieSummary.set(FFQResult.CAL_PERC_FAT, this.weeklyTotals.get(FFQResult.CAL_PERC_FAT));
    this.calorieSummary.set(FFQResult.CAL_PERC_CARB, this.weeklyTotals.get(FFQResult.CAL_PERC_CARB));

    this.weeklyTotals.delete(FFQResult.CAL_PERC_CARB);
    this.weeklyTotals.delete(FFQResult.CAL_PERC_FAT);
    this.weeklyTotals.delete(FFQResult.CAL_PERC_PROT);

  }

  getNutrientRowForKey(key: string): NutrientRow {
    if (NutrientConstants.NUTRIENT_NAMES.includes(key)) {
      const daily = this.dailyAverages.get(key);
      const weekly = this.weeklyTotals.get(key);
      return new NutrientRow(key, daily, weekly);
    }
    return null;
  }

  getCaloricRow(): CalorieRow {
    return new CalorieRow(
      this.calorieSummary.get(FFQResult.CAL_TOT),
      this.calorieSummary.get(FFQResult.CAL_PERC_CARB),
      this.calorieSummary.get(FFQResult.CAL_PERC_FAT),
      this.calorieSummary.get(FFQResult.CAL_PERC_PROT) );
  }

}

export class NutrientRow {
  name: string;
  daily: number;
  weekly: number;

  constructor(name: string, daily: number, weekly: number) {
    this.name = name;
    this.daily = daily;
    this.weekly = weekly;
  }
}

export class CalorieRow {
  total: number;
  carb: number;
  fat: number;
  protein: number;


  constructor(total: number, carb: number, fat: number, protein: number) {
    this.total = total;
    this.carb = carb;
    this.fat = fat;
    this.protein = protein;
  }
}
