package edu.fiu.ffqr.models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Recommendation implements Serializable {

	@JsonProperty("nutrientName")
	private String nutrientName;
	@JsonProperty("calculatedAmount")
	private double calculatedAmount;
	@JsonProperty("recommendedAmount")
	private double recommendedAmount;
	@JsonProperty("status")
	private String status;
	
	public Recommendation(){
		
	}
	
	public String getNutrientName() {
		return nutrientName;
	}

	public void setNutrientName(String nutrientName) {
		this.nutrientName = nutrientName;
	}

	public double getCalculatedAmount() {
		return calculatedAmount;
	}

	public void setCalculatedAmount(double calculatedValue) {
		this.calculatedAmount = calculatedValue;
	}

	public double getRecommendedAmount() {
		return recommendedAmount;
	}

	public void setRecommendedAmount(double recommendedValue) {
		this.recommendedAmount = recommendedValue;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	
}
