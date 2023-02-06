package edu.fiu.ffqr.models;

import java.io.Serializable;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodNutrients implements Serializable {
	
	@JsonProperty("foodItem")
	private FoodItem foodItem;
	@JsonProperty("nutrientList")
	private ArrayList<NutrientList> nutrientList = new ArrayList<NutrientList>();
	
	public FoodNutrients(){}
	
	public FoodNutrients(FoodItem foodItem, ArrayList<NutrientList> nutrientList){
		this.setFoodItem(foodItem);
		this.setNutrientList(nutrientList);
	}
	
	public void addNutrientList(NutrientList nutrientList) {
		this.nutrientList.add(nutrientList);
	}

	public FoodItem getFoodItem() {
		return foodItem;
	}

	public void setFoodItem(FoodItem foodItem) {
		this.foodItem = foodItem;
	}

	public ArrayList<NutrientList> getNutrientList() {
		return nutrientList;
	}

	public void setNutrientList(ArrayList<NutrientList> nutrientList) {
		this.nutrientList = nutrientList;
	}
}
