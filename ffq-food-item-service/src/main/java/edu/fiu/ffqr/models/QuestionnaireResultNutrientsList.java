package edu.fiu.ffqr.models;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;



public class QuestionnaireResultNutrientsList {
	final static int validNutrientsSize = 200;
	//global String[] validNutrients = {};
	//public static String[] validNutrients = new String[validNutrientsSize];
    
    public static String[] nutrientsList = {
        "Energy (kcal)",
        "Protein (g)",
        "Carbohydrate (g)",
        "Fat (g)",
        "% Calories from Protein",
        "% Calories from Carbs",
        "% Calories from Fat",
        "Animal Protein (g)",
        "Vegetable Protein (g)",
        "Total Dietary Fiber (g)",
        "Total Sugars (g)",
        "Added Sugars (by Total Sugars) (g)",
        "Fructose (g)",
        "Lactose (g)",
        "Starch (g)",
        "Total Grains (ounce equivalents)",
        "Whole Grains (ounce equivalents)",
        "Refined Grains (ounce equivalents)",
        "Total Saturated Fatty Acids (SFA) (g)",
        "Total Monounsaturated Fatty Acids (MUFA) (g)",
        "Total Polyunsaturated Fatty Acids (PUFA) (g)",
        "Omega-3 Fatty Acids (g)",
        "Water (g)",
        "Caffeine (mg)",
        "Vitamin B1 (Thiamin) (mg)",
        "Vitamin B2 (Riboflavin) (mg)",
        "Vitamin B3 (Niacin) (mg)",
        "Vitamin B5 (Pantothenic acid) (mg)",
        "Vitamin B6 (mg)",
        "Vitamin B9 (Folate) (mcg)",
        "Vitamin B12 (Cobalamin) (mcg)",
        "Vitamin C (Ascorbic acid) (mg)",
        "Vitamin A (Retinol) (mcg)",
        "Vitamin D (mcg)",
        "Vitamin E (mg)",
        "Vitamin K (mcg)",
        "Calcium (mg)",
        "Copper (mg)",
        "Iron (mg)",
        "Manganese (mg)",
        "Magnesium (mg)",
        "Phosphorus (mg)",
        "Potassium (mg)",
        "Selenium (mcg)",
        "Sodium (mg)",
        "Zinc (mg)"

    };

    public static ArrayList<String> getNutrientList(){
        ArrayList<String> nutrientArray = new ArrayList<String>();
    
        for(String nutrient: nutrientsList) {
           nutrientArray.add(nutrient);
        }

        return nutrientArray;
    }
   
    


		
}
