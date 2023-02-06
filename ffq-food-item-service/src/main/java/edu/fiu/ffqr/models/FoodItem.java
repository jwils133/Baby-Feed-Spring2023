package edu.fiu.ffqr.models;
import java.io.Serializable;
import java.util.ArrayList;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="food_items")
public class FoodItem implements Serializable {	
 
  @Id
  private ObjectId _id;  
  @JsonProperty("name")
  private String name;
  @Field("servings")
  private ArrayList<ServingOptions> servingsList;  
  @Field("foodTypes")
  private ArrayList<FoodType> foodTypes;
  @JsonProperty("sugar")
  private SugarSetting additionalSugar;
  @JsonProperty("primary")
  private boolean primary;
  @JsonProperty("nutrientId")
  private String nutrientId;
  @Field("portionSize")
  private String portionSize;
  //Added by Teriq Douglas. A field for saving the position of the food item upon changing.
  @Field("itemPosition")
  private int itemPosition;
  //Logical delete
  @JsonProperty("active")
  private boolean active = true;
  
  
  // Constructors
  public FoodItem() {}
  
  public FoodItem(String name, ArrayList<ServingOptions> servingsList,  ArrayList<FoodType> foodTypes, SugarSetting additionalSugar, boolean primary, String portionSize, int itemPosition) {
	    this._id = new ObjectId();
	    this.name = name;
	    
	    //default serving
		if ( servingsList == null) {
			ArrayList<ServingOptions> servingList = new ArrayList<ServingOptions>(); 
			servingList.add(new ServingOptions("1 OZ/unit"));
			this.servingsList = servingList;
		}
		else
			this.servingsList = servingsList;
		
		this.additionalSugar = additionalSugar;
	    this.foodTypes = foodTypes;
	    this.primary = primary;
	    this.portionSize = portionSize;
	    this.itemPosition = itemPosition;
  }
  
  /*public FoodItem(String name, ArrayList<ServingOptions> servings, ArrayList<FoodType> foodTypes, String portionSize) {
    this._id = new ObjectId();
    this.name = name;
    this.servingsList = servings;
    this.foodTypes = foodTypes;
    this.primary = false;
    this.portionSize = portionSize;  
  } 
  
  public FoodItem(String name,ArrayList<FoodType> foodTypes,boolean primary, String portionSize) {
	  this.name = name;  
	  this.foodTypes = foodTypes;
	  this.primary = primary;
	  this.portionSize = portionSize;  	  
} 
  
  public FoodItem(String name, ArrayList<ServingOptions> servings, ArrayList<FoodType> foodTypes, boolean primary, String portionSize) {
	this._id = new ObjectId();
    this.name = name;
    this.servingsList = servings;
	this.foodTypes = foodTypes;
	this.primary = true;
	this.portionSize = portionSize;  
  }

  public FoodItem(String name, ArrayList<ServingOptions> servings, ArrayList<FoodType> foodTypes, SugarSetting addSugar, String portionSize) {
	this._id = new ObjectId();
	this.name = name;
	this.servingsList = servings;
	this.foodTypes = foodTypes;
	this.additionalSugar = addSugar;
	this.primary = false;
	this.portionSize = portionSize;  
  }
  
  public FoodItem(ObjectId id, String name, ArrayList<ServingOptions> servings, ArrayList<FoodType> foodTypes, SugarSetting addSugar, boolean primary, String portionSize) {
    this._id = id;
    this.name = name;
	this.servingsList = servings;
	this.foodTypes = foodTypes;
	this.additionalSugar = addSugar;
	this.primary = true;
	this.portionSize = portionSize;  
  }

  public FoodItem(String name, ArrayList<FoodType> foodTypes, SugarSetting addSugar, String portionSize) {
	this._id = new ObjectId();
	this.name = name;
	this.foodTypes = foodTypes;
	this.additionalSugar = addSugar;
	this.primary = false;
	this.portionSize = portionSize;  
	
	//default serving
	ArrayList<ServingOptions> servingList = new ArrayList<ServingOptions>(); 
	servingList.add(new ServingOptions("1 OZ/unit"));
 	this.servingsList = servingList;
  } 
  
  public FoodItem(String name, ArrayList<FoodType> foodTypes, SugarSetting addSugar, boolean primary, String portionSize) {
	this._id = new ObjectId();
	this.name = name;
	this.foodTypes = foodTypes;
	this.additionalSugar = addSugar;
	this.primary = true;
	this.portionSize = portionSize;  
		
	//default serving
	ArrayList<ServingOptions> servingList = new ArrayList<ServingOptions>(); 
	servingList.add(new ServingOptions("1 OZ/unit"));
	this.servingsList = servingList;
  }

  public FoodItem(String name, ArrayList<FoodType> foodTypes, String portionSize) {
	this._id = new ObjectId();
	this.name = name;
	this.foodTypes = foodTypes;
	this.primary = false;	
	this.portionSize = portionSize;  
	
	//default serving
	ArrayList<ServingOptions> servingList = new ArrayList<ServingOptions>(); 
	servingList.add(new ServingOptions("1 OZ/unit"));
	this.servingsList = servingList;
  }*/
  


  public String getName() { 
    return this.name; 
  }

  public String getId() { 
	return _id.toHexString();
  }
  
  public void setId(ObjectId id) {
	this._id = id;
  }
  
  public void setName(String name) { 
	this.name = name; 
  }

  public ArrayList<ServingOptions> getServingsList() {
	return servingsList;
  }

  public void setServingsList(ArrayList<ServingOptions> servingsList) {
    this.servingsList = servingsList;
  }
  
  public ArrayList<FoodType> getFoodTypes() {
    return this.foodTypes;
  }
  
  public String getNutrientId() {
	    return this.foodTypes.get(0).getNutrientListID();
	  }
  
  public void setFoodTypes(ArrayList<FoodType> foodTypes) {
    this.foodTypes = foodTypes;
  }
  
  public SugarSetting getAdditionalSugar() {
	return additionalSugar;
  }

  public void setAdditionalSugar(SugarSetting additionalSugar) {
	this.additionalSugar = additionalSugar;
  }

  public boolean isPrimary() {
	return primary;
  }

  public void setPrimary(boolean primary) {
	this.primary = primary;
  }
  
  public String getPortionSize() {
		return portionSize;
  }

  public void setPortionSize(String portionSize) {
		this.portionSize = portionSize;
  }

  public void setItemPosition(int itemPosition) { this.itemPosition = itemPosition; }

  public int getItemPosition() { return itemPosition; }

	public void delete(){
		this.active = false;
	}

}
