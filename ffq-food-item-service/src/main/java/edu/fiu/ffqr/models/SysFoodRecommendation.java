package edu.fiu.ffqr.models;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="sys_food_recommendations")
public class SysFoodRecommendation implements Serializable {
 	
	@JsonProperty("categoryName")
	private String categoryName;
	@JsonProperty("unit")
	private String unit;
	@JsonProperty("recommendationsByAge")
	Map<String, List<FoodRecommendationRange>> recommendationsByAge = new HashMap<String, List<FoodRecommendationRange>>();

	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public Map<String, List<FoodRecommendationRange>> getRecommendationsByAge() {
		return recommendationsByAge;
	}
	public void setRecommendationsByAge(Map<String, List<FoodRecommendationRange>> recommendationsByAge) {
		this.recommendationsByAge = recommendationsByAge;
	}
}
