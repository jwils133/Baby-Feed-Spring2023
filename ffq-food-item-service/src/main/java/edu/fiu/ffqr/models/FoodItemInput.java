package edu.fiu.ffqr.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodItemInput {
	
	@JsonProperty("name")
	private String name;
	@JsonProperty("frequency")
	private int frequency;
	@JsonProperty("frequencyType")
	private String frequencyType; 
	@JsonProperty("nutrientListID")
	private String nutrientListID;
	@JsonProperty("serving")
	private String serving;
	@JsonProperty("sugar")
	private int additionalSugar;

	public FoodItemInput(String name, int frequency, String frequencyType, String nutrientListID, String serving, int additionalSugar) {
		this.name = name;
		this.nutrientListID = nutrientListID;
		this.frequency = frequency;
		this.frequencyType = frequencyType;
		this.serving = serving;
		this.additionalSugar = additionalSugar;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNutrientListID() {
		return nutrientListID;
	}

	public void setNutrientListID(String nutrientListID) {
		this.nutrientListID = nutrientListID;
	}

	public int getFrequency() {
		if (frequency <= 0)
			throw new IllegalArgumentException("Negative or zero frequency not allowed");
		return frequency;
	}

	public void setFrequency(int frequency) {
		if (frequency <= 0)
			throw new IllegalArgumentException("Negative or zero frequency not allowed");
		
		this.frequency = frequency;
	}

	public String getFrequencyType() {
		return frequencyType;
	}

	public void setFrequencyType(String frequencyType) {
		this.frequencyType = frequencyType;
	}

	public String getServing() {
		return serving;
	}

	public void setServing(String serving) {
		this.serving = serving;
	}
	
	public int getAdditionalSugar() {
		return additionalSugar;
	}

	public void setAdditionalSugar(int additionalSugar) {
		this.additionalSugar = additionalSugar;
	}
	
}
