package edu.fiu.ffqr.models;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="sys_nutrients_recommendations")
public class SysNutrientRecommendation implements Serializable {

	@Id
	private ObjectId _id;  
	@JsonProperty("nutrientName")
	private String nutrientName;
	@JsonProperty("estimatedAverageByAge")
	Map<String, Double> estimatedAverageByAge = new HashMap<String, Double>();
	
	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public void setNutrientName(String nutrientName) {
		this.nutrientName = nutrientName;
	}
	
	public String getNutrientName() {
		return this.nutrientName;
	}

	public Map<String, Double> getEstimatedAverageByAge() {
		return estimatedAverageByAge;
	}

	public void setEstimatedAverageByAge(Map<String, Double> estimatedAverageByAge) {
		this.estimatedAverageByAge = estimatedAverageByAge;
	}	
}
