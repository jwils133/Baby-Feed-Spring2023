package edu.fiu.ffqr.models;
import java.io.Serializable;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="food_description")
public class FoodDescription implements Serializable {

    @Id
    private ObjectId _id;
    @JsonProperty("imageUrl")
    private String imageUrl;
    @Field("foodItemGroupName")
    private String foodItemGroupName;
    @Field("firstBracketIntake")
    private String firstBracketIntake;
    @Field("secondBracketIntake")
    private String secondBracketIntake;
    @Field("thirdBracketIntake")
    private String thirdBracketIntake;
    @Field("description")
    private String description;


    // Constructors
    public FoodDescription() {
    }

    public FoodDescription(String imageUrl, String foodItemGroupName, String firstBracketIntake, String secondBracketIntake, 
    String thirdBracketIntake, String description) {
        this._id = new ObjectId();
        this.imageUrl = imageUrl;
        this.foodItemGroupName = foodItemGroupName;
        this.firstBracketIntake = firstBracketIntake;
        this.secondBracketIntake = secondBracketIntake;
        this.thirdBracketIntake = thirdBracketIntake;
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getFoodItemGroupName() {
        return foodItemGroupName;
    }

    public void setFoodItemGroupName(String foodItemGroupName) {
        this.foodItemGroupName = foodItemGroupName;
    }

    public String getFirstBracketIntake() {
        return firstBracketIntake;
    }

    public void setFirstBracketIntake(String firstBracketIntake) {
        this.firstBracketIntake = firstBracketIntake;
    }

    public String getSecondBracketIntake() {
        return secondBracketIntake;
    }

    public void setSecondBracketIntake(String secondBracketIntake) {
        this.secondBracketIntake = secondBracketIntake;
    }

    public String getThirdBracketIntake() {
        return thirdBracketIntake;
    }

    public void setThirdBracketIntake(String thirdBracketIntake) {
        this.thirdBracketIntake = thirdBracketIntake;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String get_id() { 
		return _id.toHexString();
	}
}