package edu.fiu.ffqr.models;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodType implements Serializable {
	@JsonProperty("typeName")
	private String typeName;
	@JsonProperty("nutrientListID")
	private String nutrientListID;
	@JsonProperty("category")
	private String category;
	
	public FoodType() {}
	
	public FoodType(String nutrientListID, String category) {
		this.typeName = null;
		this.nutrientListID = nutrientListID;
		this.category = category;
	}
	
	public FoodType(String name, String nutrientListID, String category) {
		if (nutrientListID == null && name != null) {
			throw new IllegalArgumentException("NutrientList cannot be empty");
		}
		this.typeName = name;
		this.nutrientListID = nutrientListID;
		this.category = category;
	}

	public String getTypeName() {
//		if (nutrientListID == null && typeName != null) {
//			throw new IllegalArgumentException("2 cannot be empty");
//		}
		return typeName;
	}

	public void setTypeName(String typeName) {
//		if (this.nutrientListID == null && typeName != null) {
//			throw new IllegalArgumentException("3 cannot be empty");
//		}
		this.typeName = typeName;
	}

	public String getNutrientListID() {
		return nutrientListID;
	}

	public void setNutrientListID(String nutrientListID) {
		this.nutrientListID = nutrientListID;
	}
	
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
}


