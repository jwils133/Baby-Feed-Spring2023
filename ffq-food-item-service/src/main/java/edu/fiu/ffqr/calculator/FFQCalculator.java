package edu.fiu.ffqr.calculator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import edu.fiu.ffqr.models.Result;
import edu.fiu.ffqr.models.FoodItemInput;
import edu.fiu.ffqr.models.NutrientList;
import edu.fiu.ffqr.models.QuestionnaireResultNutrientsList;
import edu.fiu.ffqr.models.ValidNutrientList;
import edu.fiu.ffqr.service.NutrientListService;

public class FFQCalculator {

    // Recommended Volume of milk for infants of differing age in months
    // (exclusively in ml or grams)
    static double oneMonthInfantBreastMilkVolume = 699.0;
    static double twoMonthInfantBreastMilkVolume = 731.0;
    static double threeMonthInfantBreastMilkVolume = 751.0;
    static double fourMonthInfantBreastMilkVolume = 780.0;
    static double fiveMonthInfantBreastMilkVolume = 796.0;
    static double sixMonthInfantBreastMilkVolume = 854.0;
    static double sevenMonthInfantBreastMilkVolume = 867.0;
    static double eightMonthInfantBreastMilkVolume = 815.0;
    static double nineMonthInfantBreastMilkVolume = 890.0;
    static double tenMonthInfantBreastMilkVolume = 900.0;
    static double elevenMonthInfantBreastMilkVolume = 910.0;
    static double twelveMonthInfantBreastMilkVolume = 900.0;
    static double thirteenThroughTwentyFourMonthInfantBreastMilkVolume = 500.0;
    static final double ouncesToMilliliter = 29.5735;

    //Khalid Alamoudi - Added total calories to the parameters and return
    public static Result calculateTotals(String questionnaireId, String userId, String userType, String date, int ageInMonths, ArrayList<FoodItemInput> userChoices,
                                         NutrientListService nlService, String gender, String patientName) {

        // get list of valid nutrients

        String[] nutrients = ValidNutrientList.validNutrients;

        Map<String, Double> weeklyTotals = new HashMap<String, Double>();
        Map<String, Double> dailyAverages = new HashMap<String, Double>();

        if (userChoices.size() == 0) {
            for (int i = 0; i < nutrients.length; i++) {
                weeklyTotals.put(nutrients[i], 0.0);
                dailyAverages.put(nutrients[i], 0.0);
            }
            return new Result(questionnaireId, userId, userType, date, ageInMonths, userChoices, weeklyTotals, dailyAverages, null, gender, patientName);
        }

        NutrientList tbspSugar = nlService.getWithNutrientListID("suga");

        double amountOfServings = 0.0;
        double breastMilkNeeded = 0.0;
        double dailyFormulaServing = 0.0;

        //for each food item that the user selected
        for (FoodItemInput foodItem : userChoices) {

            // Formula is calculated before breastmilk so we need to go through this first, if chosen.
            if (foodItem.getNutrientListID().equalsIgnoreCase("form")) {
                //get amount of servings for item
                if (foodItem.getServing() == null || foodItem.getServing().isEmpty())
                    amountOfServings = 1;
                else
                    amountOfServings = Double.parseDouble(foodItem.getServing().split(" ")[0]);

                dailyFormulaServing = amountOfServings * foodItem.getFrequency();

                if (foodItem.getFrequencyType().equalsIgnoreCase("week")) {
                    dailyFormulaServing /= 7.0;
                }

                break;
            }
        }

        // breastMilkNeeded will always calculate the amount of breastmilk that is needed based on FFQ input.
        breastMilkNeeded = calculateFormulaAndBreastMilk(ageInMonths, dailyFormulaServing);

        //for each food item that the user selected
        for (FoodItemInput foodItem : userChoices) {

            //find record with that nutrientListID
            NutrientList selectedFoodType = nlService.getWithNutrientListID(foodItem.getNutrientListID());

            //get amount of servings for item
            if (foodItem.getServing() == null || foodItem.getServing().isEmpty())
                amountOfServings = 1;
            else
                amountOfServings = Double.parseDouble(foodItem.getServing().split(" ")[0]);

            //if user selected daily frequency
            if (foodItem.getFrequencyType().equalsIgnoreCase("day")) {

                //if item has additional sugar, add corresponding values for sugar 1 tbsp.
                if (foodItem.getAdditionalSugar() != 0) {
                    for (int i = 0; i < nutrients.length; i++) {
                        double nutrientValuePerServing = tbspSugar.getNutrient(nutrients[i]);
                        dailyAverages.put(nutrients[i], dailyAverages.getOrDefault(nutrients[i], 0.0) + nutrientValuePerServing * foodItem.getAdditionalSugar() * foodItem.getFrequency());
                        weeklyTotals.put(nutrients[i], weeklyTotals.getOrDefault(nutrients[i], 0.0) + 7 * nutrientValuePerServing * foodItem.getAdditionalSugar() * foodItem.getFrequency());
                    }
                }

                //iterate nutrients and update daily average
                for (int i = 0; i < nutrients.length; i++) {
                    double additionalIntake = 0.0;
                    //additional intake = amount of servings * value of nutrient per serving
                    double nutrientValuePerServing = selectedFoodType.getNutrient(nutrients[i]);

                    if (selectedFoodType.getNutrientListID().equalsIgnoreCase("brea")) {
                        if (breastMilkNeeded != 0) {
                            // when breastMilkNeeded !=0 & the baby is taking breastmilk, means the formula milk is not enough
                            // so baby is getting nutrient from both breastmilk & formula
                            additionalIntake = nutrientValuePerServing * breastMilkNeeded;
                            if (nutrients[i].equalsIgnoreCase("Energy (kcal)")) {
                                additionalIntake = 19.8446 * (breastMilkNeeded / ouncesToMilliliter);
                            }
                        } else {
                            // when breastMilkNeeded = 0, it means formula milk is higher than recommendation
                            // then according to prof palacios's requirement, the extra breaskmilk should be counted
                            // per serving = 3 oz
                            additionalIntake = 3 * foodItem.getFrequency() * 19.8446;
                        }

                    } else {
                        additionalIntake = amountOfServings * foodItem.getFrequency() * nutrientValuePerServing;
                    }

                    double finalDailyValue = dailyAverages.getOrDefault(nutrients[i], 0.0) + additionalIntake;

                    dailyAverages.put(nutrients[i], finalDailyValue);
                    weeklyTotals.put(nutrients[i], finalDailyValue * 7.00);
                }
            }

            //if user selected weekly frequency
            else if (foodItem.getFrequencyType().equalsIgnoreCase("week")) {

                //if item has additional sugar, add corresponding values for sugar 1 tbsp.
                if (foodItem.getAdditionalSugar() != 0) {
                    for (int i = 0; i < nutrients.length; i++) {
                        double nutrientValuePerServing = tbspSugar.getNutrient(nutrients[i]);
                        weeklyTotals.put(nutrients[i], weeklyTotals.getOrDefault(nutrients[i], 0.0) + nutrientValuePerServing * foodItem.getAdditionalSugar() * foodItem.getFrequency());
                        dailyAverages.put(nutrients[i], dailyAverages.getOrDefault(nutrients[i], 0.0) + (nutrientValuePerServing * foodItem.getAdditionalSugar() * foodItem.getFrequency()) / 7.0);
                    }
                }

                //iterate nutrients and update weekly intake
                for (int i = 0; i < nutrients.length; i++) {
                    double additionalIntake = 0.0;
                    //additional intake = amount of servings * value of nutrient per serving
                    double nutrientValuePerServing = selectedFoodType.getNutrient(nutrients[i]);

                    if (selectedFoodType.getNutrientListID().equalsIgnoreCase("brea")) {
                        additionalIntake = nutrientValuePerServing * breastMilkNeeded;
                        // PO said that breastmilk calculations must be minimum 1 serving per day.
                        // This means that we should have 7 or more servings when choosing weekly intake.
                        if (foodItem.getFrequency() < 7) {
                            additionalIntake = 0.0;
                        }
                    } else {
                        additionalIntake = amountOfServings * foodItem.getFrequency() * nutrientValuePerServing;
                        additionalIntake /= 7.00;
                    }

                    double finalDailyValue = dailyAverages.getOrDefault(nutrients[i], 0.0) + additionalIntake;

                    dailyAverages.put(nutrients[i], finalDailyValue);
                    weeklyTotals.put(nutrients[i], finalDailyValue * 7.00);
                }
            } else {
                throw new IllegalArgumentException("Frequency type must be day or week");
            }
        }

        //calculate % calories from protein, fat, and carbs

        //% calories from fat
        double caloriesFromFatWeekly = weeklyTotals.get("Fat (g)") * 9;
        double percentageCalFromFatWeekly = caloriesFromFatWeekly * 100 / weeklyTotals.get("Energy (kcal)");
        weeklyTotals.put("% Calories from Fat", percentageCalFromFatWeekly);
        dailyAverages.put("% Calories from Fat", weeklyTotals.get("% Calories from Fat"));

        //% calories from protein
        double caloriesFromProteinWeekly = weeklyTotals.get("Protein (g)") * 4;
        double percentageCalFromProteinWeekly = caloriesFromProteinWeekly * 100 / weeklyTotals.get("Energy (kcal)");
        weeklyTotals.put("% Calories from Protein", percentageCalFromProteinWeekly);
        dailyAverages.put("% Calories from Protein", weeklyTotals.get("% Calories from Protein"));

        //% calories from carbs
        double caloriesFromCarbsWeekly = weeklyTotals.get("Carbohydrate (g)") * 4;
        double percentageCalFromCarbsWeekly = caloriesFromCarbsWeekly * 100 / weeklyTotals.get("Energy (kcal)");
        weeklyTotals.put("% Calories from Carbs", percentageCalFromCarbsWeekly);
        dailyAverages.put("% Calories from Carbs", weeklyTotals.get("% Calories from Carbs"));

        //Khalid Alamoudi - Change below to return the modified versions of dailyAverages and weeklyTotals
        //===============================================================
        //--Calculating total calories
        double totalCalories = weeklyTotals.get("% Calories from Fat") + weeklyTotals.get("% Calories from Protein") +
                weeklyTotals.get("% Calories from Carbs");
        weeklyTotals.put("Total Calories (g)", totalCalories);
        dailyAverages.put("Total Calories (g)", weeklyTotals.get("Total Calories (g)"));

        //---- modifying weeklyTotals and dailyAverages
        Map<String, Double> modifiedDailyAverages = modifiedMap(dailyAverages);
        Map<String, Double> modifiedWeeklyTotals = modifiedMap(weeklyTotals);
        Map<String, Double> modDailyAverages = new HashMap<String, Double>();
        Map<String, Double> modWeeklyTotals = new HashMap<String, Double>();

        for (String key : modifiedWeeklyTotals.keySet()) {
            if (QuestionnaireResultNutrientsList.getNutrientList().contains(key)) {
                modDailyAverages.put(key, modifiedDailyAverages.get(key));
                modWeeklyTotals.put(key, modifiedWeeklyTotals.get(key));
            }
        }

        Result results = new Result(questionnaireId, userId, userType, date, ageInMonths, userChoices, weeklyTotals, dailyAverages, null, gender, patientName);
        //End of added code
        //===============================================================
        return results;
    }

    //Khalid Alamoudi - Added functions to create modified version of any map into the required 3 digit max criteria
    // set by the PO
    //================================================================================
    public static Map<String, Double> modifiedMap(Map<String, Double> mapInput) {

        Map<String, Double> newMap = new HashMap<>();
        for (String key : mapInput.keySet()) {
            double value = mapInput.get(key);
            newMap.put(key, threeDigitView(value));
        }
        return newMap;
    }

    public static double threeDigitView(double value) {
        double newValue = value;
        if (value >= 100) {
            newValue = (double) ((int) value);
        } else if ((value >= 10) && (value < 100)) {
            newValue = ((double) ((int) (value * 10))) / 10.0;
        } else {
            newValue = ((double) ((int) (value * 100))) / 100.0;
        }
        return newValue;
    }
    //End of added code
    //===================================================================================

    /*
    Method To Calculate Amount of Breast Milk needed based on Calculated amount of formula.
    If an infant consumes at least breastmilk 1 per day and also formula,
    calculate volume of formula first and then subtract from the amount recommended for milk for that age.
    Example: if 2 months old baby is consuming 700 ml (same as g) of formula and breastfed for 1 or more times per day,
    then the estimated volume from breastmilk will be about 31 ml since twoMonthInfantBreastMilkVolume = 731.0;

    @param ageInMonths: the age of the infant, which drives the amount of breastmilk originally required.
    @param amountOfServings: the calculated amount of formula passed into the method.
    @return Returns the positive amount of breastmilk still required, 0 otherwise.
    */
    private static double calculateFormulaAndBreastMilk(int ageInMonths, double amountOfServings) {
        double servingsInMilliliters = amountOfServings * ouncesToMilliliter;
        double remainingMilliters = 0.0;

        if (ageInMonths == 1) {
            remainingMilliters = oneMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 2) {
            remainingMilliters = twoMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 3) {
            remainingMilliters = threeMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 4) {
            remainingMilliters = fourMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 5) {
            remainingMilliters = fiveMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 6) {
            remainingMilliters = sixMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 7) {
            remainingMilliters = sevenMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 8) {
            remainingMilliters = eightMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 9) {
            remainingMilliters = nineMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 10) {
            remainingMilliters = tenMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 11) {
            remainingMilliters = elevenMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths == 12) {
            remainingMilliters = twelveMonthInfantBreastMilkVolume - servingsInMilliliters;
        } else if (ageInMonths >= 13 && ageInMonths <= 24) {
            remainingMilliters = thirteenThroughTwentyFourMonthInfantBreastMilkVolume - servingsInMilliliters;
        }

        if (remainingMilliters > 0) {
            return remainingMilliters;
        }

        return 0.0;
    }
}