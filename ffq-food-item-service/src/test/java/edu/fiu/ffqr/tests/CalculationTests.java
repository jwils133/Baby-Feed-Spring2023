package edu.fiu.ffqr.tests;

import static org.junit.Assert.*;

import java.util.ArrayList;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.fiu.ffqr.calculator.FFQCalculator;
import edu.fiu.ffqr.models.FFQResult;
import edu.fiu.ffqr.models.FoodItemInput;
import edu.fiu.ffqr.service.NutrientListService;
/*
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class CalculationTests {
	
	@Autowired
	private NutrientListService nutrientService;
	
	@Test
	public void noSugarItems() {
		ArrayList<FoodItemInput> responses = new ArrayList<FoodItemInput>();
		responses.add(new FoodItemInput("Breast Milk", 5, "day", "brea", null, 0));
		responses.add(new FoodItemInput("Orange juice", 3, "week", "oranjuic", null, 0));
		responses.add(new FoodItemInput("Bread refined", 2, "day", "brearef", "0.75 slice/roll/piece", 0));
		
		FFQResult result = FFQCalculator.calculateTotals(responses, nutrientService);
		
		//weekly
		assertEquals(result.getWeeklyTotals().get("Total Polyunsaturated Fatty Acids (PUFA) (g)"), 6.125, 0.001);
		assertEquals(result.getWeeklyTotals().get("Magnesium (mg)"), 115.375, 0.001);
		assertEquals(result.getWeeklyTotals().get("Total Sugars (g)"), 52.95, 0.001);
		assertEquals(result.getWeeklyTotals().get("% Calories from Fat"), 16.538, 0.001);
		
		//daily
		assertEquals(result.getDailyAverages().get("Total Polyunsaturated Fatty Acids (PUFA) (g)"), 0.875, 0.001);
		assertEquals(result.getDailyAverages().get("Magnesium (mg)"), 16.482, 0.001);
		assertEquals(result.getDailyAverages().get("Total Sugars (g)"), 7.564, 0.001);
		assertEquals(result.getDailyAverages().get("% Calories from Fat"), 16.538, 0.001);
		
	}
	
	@Test
	public void sugarItems() {
		ArrayList<FoodItemInput> responses = new ArrayList<FoodItemInput>();
		responses.add(new FoodItemInput("Breast Milk", 5, "day", "brea", null, 0));
		responses.add(new FoodItemInput("Bread refined", 3, "week", "brearef", "0.75 slice/roll/piece", 0));
		responses.add(new FoodItemInput("Milk with chocolate/strawberry or vanilla (include frozen beverages, shakes, hot chocolate, etc.)", 2, "day", "milkchoc", "4 OZ or less", 3));
		
		FFQResult result = FFQCalculator.calculateTotals(responses, nutrientService);
		
		//weekly
		assertEquals(result.getWeeklyTotals().get("Total Polyunsaturated Fatty Acids (PUFA) (g)"), 2, 0.001);
		assertEquals(result.getWeeklyTotals().get("Magnesium (mg)"), 262, 0.001);
		assertEquals(result.getWeeklyTotals().get("Total Sugars (g)"), 363.975, 0.001);
		assertEquals(result.getWeeklyTotals().get("% Calories from Fat"), 19.092, 0.001);
		
		//daily
		assertEquals(result.getDailyAverages().get("Total Polyunsaturated Fatty Acids (PUFA) (g)"), 0.285, 0.001);
		assertEquals(result.getDailyAverages().get("Magnesium (mg)"), 37.428, 0.001);
		assertEquals(result.getDailyAverages().get("Total Sugars (g)"), 51.996, 0.001);
		assertEquals(result.getDailyAverages().get("% Calories from Fat"), 19.092, 0.001);
	}

}
*/
