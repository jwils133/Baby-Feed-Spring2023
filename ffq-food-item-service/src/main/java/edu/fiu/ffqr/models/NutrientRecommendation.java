package edu.fiu.ffqr.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="nutrients_recommendations")
public class NutrientRecommendation implements Serializable {

	@JsonProperty("questionnaireId")
	private String questionnaireId; 
	
	@JsonProperty("patientAge")
	int patientAgeInMonths;
	@JsonProperty("gender")
	String gender;
	List <Recommendation> recommendationsList;
	
	public NutrientRecommendation() {
		recommendationsList = new ArrayList<>();
	}
	
	public String getQuestionnaireId() {
		return questionnaireId;
	}

	public void setQuestionnaireId(String questionnaireId) {
		this.questionnaireId = questionnaireId;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public int getPatientAgeInMonths() {
		return patientAgeInMonths;
	}

	public void setPatientAgeInMonths(int patientAgeInMonths) {
		this.patientAgeInMonths = patientAgeInMonths;
	}

	public List<Recommendation> getRecommendationsList() {
		return recommendationsList;
	}

	public void setRecommendationsList(List<Recommendation> recommendationsList) {
		this.recommendationsList = recommendationsList;
	}
	
}
