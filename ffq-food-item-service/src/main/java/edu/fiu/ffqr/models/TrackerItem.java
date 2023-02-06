package edu.fiu.ffqr.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TrackerItem {
	
	@JsonProperty("food")
	private String food;
	@JsonProperty("response")
	private String response;

	public TrackerItem(String food, String response) {
		this.food = food;
		this.response = response;
	}
	
	public String getFood() {
		return food;
	}

	public void setFood(String food) {
		this.food = food;
	}

	public String getNutrientListID() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}
}
