package edu.fiu.ffqr.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;

import edu.fiu.ffqr.calculator.FFQCalculator;
import edu.fiu.ffqr.models.Result;
import edu.fiu.ffqr.models.ServingOptions;
import edu.fiu.ffqr.models.SugarSetting;
import edu.fiu.ffqr.models.FoodItem;
import edu.fiu.ffqr.models.FoodItemInput;
import edu.fiu.ffqr.models.FoodNutrients;
import edu.fiu.ffqr.models.FoodType;
import edu.fiu.ffqr.models.NutrientList;
import edu.fiu.ffqr.service.FFQFoodEntryService;
import edu.fiu.ffqr.service.NutrientListService;
import edu.fiu.ffqr.service.ResultsService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDate; 

@RestController
@CrossOrigin(origins = "*")
public class FoodItemController {
  
  @Autowired
  private FFQFoodEntryService foodItemService;
  
  @Autowired
  private NutrientListService nutrientListService;
  
  @Autowired
  private NutrientListService foodTypeService;
  
  //Added: Dariana Gonzalez
  @Autowired
  private ResultsService resultsService;
  
  public FoodItemController() {}
  
  @GetMapping("/allfoodsnutrients")
  public List<FoodItem> allFoods() throws JsonProcessingException {
	  
	  List<FoodItem> foods = foodItemService.getAll();
	  
	  return foods;
  }  

  @GetMapping("/foodnutrients/{foodItemId}")
  public FoodNutrients getFoodNutrients(@PathVariable("foodItemId") ObjectId id) throws JsonProcessingException {
	  
	  FoodItem foodItem = new FoodItem();	  
	  NutrientList nutrientList = new NutrientList();	
	  
	  // retrieve the food item
	  foodItem = foodItemService.getFoodItemBy_id(id);
	  
	  FoodNutrients foodNutrients = new FoodNutrients();
	  foodNutrients.setFoodItem(foodItem);
	  
	  for(FoodType foodType : foodItem.getFoodTypes()) {
		  nutrientList = nutrientListService.getWithNutrientListID(foodType.getNutrientListID());
		  foodNutrients.addNutrientList(nutrientList);
		  
	  } 	  
	  	
	  
	  return foodNutrients;
  }
  
  @PostMapping("/createfoodnutrients")
  public FoodNutrients createFoodNutrients(@RequestBody FoodNutrients foodNutrients) throws JsonProcessingException {
	  
	  ArrayList<FoodType> foodTypesList = foodNutrients.getFoodItem().getFoodTypes();
	  
	  // validate nutrientID does not exist 
	  for (FoodType foodType : foodTypesList) {
	  
		  String requestNutrientID = foodType.getNutrientListID();
		  
		  if (nutrientListService.getWithNutrientListID(requestNutrientID) != null)		  
			  throw new IllegalArgumentException("Nutrient ID: " + foodType.getNutrientListID() + " already exists");
	  }
	  
	  foodItemService.create(foodNutrients.getFoodItem());
	  
	  for (NutrientList nutrientlist: foodNutrients.getNutrientList()) {
		  nutrientListService.create(nutrientlist);
	  }
	  
	  return foodNutrients;
  }
  
  @PutMapping("/updatefoodnutrients")
  public FoodNutrients updateFoodNutrients(@RequestBody FoodNutrients foodNutrients) throws JsonProcessingException {
	  	  
	  foodItemService.create(foodNutrients.getFoodItem());
	  
	  for (NutrientList nutrientlist: foodNutrients.getNutrientList()) {
		  nutrientListService.create(nutrientlist);
	  }
	  
	  return foodNutrients;
  }
  
  @GetMapping("/fooditems")
  public List<FoodItem> getAllFoods() throws JsonProcessingException {
	  List<FoodItem> foods = foodItemService.getAll();
	  return foods;
  }
  
  @GetMapping("/{name}")
  public FoodItem getItemsWithName(@PathVariable("name") String name) throws JsonProcessingException {
	  return foodItemService.getEntryWithName(name);
  }
  
  @GetMapping("/getByID/{nutrientListID}")
  public FoodItem getItemWithID(@PathVariable("nutrientListID") String nutrientListID) {
	  return foodItemService.getEntryWithNutrientListID(nutrientListID);
  }
  
  @PostMapping("/create")
  public FoodItem create(@RequestBody FoodItem newItem) {
	  
	  FoodItem fi = null;
	  if (foodItemService.getEntryWithName(newItem.getName()) != null) {
		  throw new IllegalArgumentException("A record with name " + newItem.getName() + " already exists");
	  }
	  
	  //check nutrientListID is in nutrient list collection 
	  for (int i = 0; i < newItem.getFoodTypes().size(); i++) {
		  String nutrientListID = newItem.getFoodTypes().get(i).getNutrientListID();
		  NutrientList matchingID = foodTypeService.getWithNutrientListID(nutrientListID);
		  if (matchingID == null) {
			  throw new IllegalArgumentException(nutrientListID + " is not in the nutrientList collection");
		  }
		  
	  }
	  
	  //check that none of the nutrientListIDs are used in other food items
	  for (int i = 0; i < newItem.getFoodTypes().size(); i++) {
		  if(foodItemService.getEntryWithNutrientListID(newItem.getFoodTypes().get(i).getNutrientListID()) != null) {
			  String foodItemName = foodItemService.getEntryWithNutrientListID(newItem.getFoodTypes().get(i).getNutrientListID()).getName();
			  throw new IllegalArgumentException(newItem.getFoodTypes().get(i).getNutrientListID() + " is already used in a different food item, " + foodItemName
					  + " and cannot be used in item " + newItem.getName());
		  }
	  }
	  
	  
	  fi = new FoodItem(newItem.getName(), newItem.getServingsList(), newItem.getFoodTypes(), newItem.getAdditionalSugar(), newItem.isPrimary(), newItem.getPortionSize(), newItem.getItemPosition());
	  foodItemService.create(fi);
	
	  
	  return fi;
  }

	@PutMapping("/update/{id}")
	public FoodItem updateItemPosition(@PathVariable ObjectId id, @RequestBody FoodItem position) throws JsonProcessingException {

		FoodItem foodItem = foodItemService.getFoodItemBy_id(id);

		if (null == foodItem) {
			throw new IllegalArgumentException("The food item id does not exist");
		}


		foodItem.setItemPosition(position.getItemPosition());


		foodItemService.update(foodItem);

		return foodItem;
	}

  @PostMapping("/createMany")
  public List<FoodItem> create(@RequestBody ArrayList<FoodItem> data) {
	  for (FoodItem newItem: data) {
		  FoodItem fi = null;
		  if (foodItemService.getEntryWithName(newItem.getName()) != null) {
			  throw new IllegalArgumentException("A record with name " + newItem.getName() + " already exists");
		  }
		  
		  //check nutrientListID is in nutrient list collection 
		  for (int i = 0; i < newItem.getFoodTypes().size(); i++) {
			  String nutrientListID = newItem.getFoodTypes().get(i).getNutrientListID();
			  NutrientList matchingID = foodTypeService.getWithNutrientListID(nutrientListID);
			  if (matchingID == null) {
				  throw new IllegalArgumentException(nutrientListID + " is not in the nutrientList collection");
			  }
			  
		  }
		  
		  //check that none of the nutrientListIDs are used in other food items
		  for (int i = 0; i < newItem.getFoodTypes().size(); i++) {
			  if(foodItemService.getEntryWithNutrientListID(newItem.getFoodTypes().get(i).getNutrientListID()) != null) {
				  String foodItemName = foodItemService.getEntryWithNutrientListID(newItem.getFoodTypes().get(i).getNutrientListID()).getName();
				  throw new IllegalArgumentException(newItem.getFoodTypes().get(i).getNutrientListID() + " is already used in a different food item, " + foodItemName
						  + " and cannot be used in item " + newItem.getName());
			  }
		  }
		  
		  if (newItem.getServingsList() == null && newItem.getAdditionalSugar() == null && newItem.isPrimary()) {
			  //fi = new FoodItem(newItem.getName(), newItem.getFoodTypes(), newItem.isPrimary());
			  //foodItemService.create(fi);  
		  }
		  else if (newItem.getServingsList() == null && newItem.getAdditionalSugar() == null) {
			  //fi = new FoodItem(newItem.getName(), newItem.getFoodTypes());
			  //foodItemService.create(fi);  
		  }  
		  else if (newItem.getAdditionalSugar() == null && !newItem.isPrimary()) {
			  //fi = new FoodItem(newItem.getName(), newItem.getServingsList(), newItem.getFoodTypes());
			  //foodItemService.create(fi);
		  }
		  else if (newItem.getAdditionalSugar() == null && newItem.isPrimary()) {
			  //fi = new FoodItem(newItem.getName(), newItem.getServingsList(), newItem.getFoodTypes(), newItem.isPrimary());
			  //foodItemService.create(fi);
		  }
		  else if (newItem.getServingsList() == null && !newItem.isPrimary()) {
			  //fi = new FoodItem(newItem.getName(), newItem.getFoodTypes(), newItem.getAdditionalSugar());
			  //foodItemService.create(fi);
		  }
		  else if (newItem.getServingsList() == null && newItem.isPrimary()) {
			  //fi = new FoodItem(newItem.getName(), newItem.getFoodTypes(), newItem.getAdditionalSugar(), newItem.isPrimary());
			  //foodItemService.create(fi);
		  }
		  else {
			  //fi = new FoodItem(newItem.getName(), newItem.getServingsList(), newItem.getFoodTypes(), newItem.getAdditionalSugar());
			  //foodItemService.create(fi);
		  }

	  }
	  
	  return data;
  }
  
  /*
   * Modified by Dariana Gonzalez (10/2019) to delete by ObjectId
   */
  @DeleteMapping("/delete")
  public String delete(@RequestParam ObjectId id) {
	  
	  FoodItem foodItem = new FoodItem();	  
	  ArrayList<String> nutrientListIds = new ArrayList<String>();
	  
	  foodItem = foodItemService.getFoodItemBy_id(id);
	  
	  for (int i = 0; i < foodItem.getFoodTypes().size(); i++) {
		  nutrientListIds.add(foodItem.getFoodTypes().get(i).getNutrientListID());
	  }
	  
	  //delete these nutrientListIds in nutrient_lists collection
	  for (int i = 0; i < nutrientListIds.size(); i++) {
		  NutrientList nl = foodTypeService.getWithNutrientListID(nutrientListIds.get(i));
		  foodTypeService.delete(nl.getNutrientListID());
	  }
	  
	  //delete the food item from the food_items collection
	  foodItemService.deleteById(id);
  	  return "Deleted " + id + " (" + foodItem.getName() + ")" ;
  }
  
  /*
   * Modified by Dariana Gonzalez (09/2019) to receive questionnaireId as parameter and save the results in the DB
   */
  @PostMapping("/calculate/{questionnaireId}/{ageInMonths}/{userType}/{userID}/{gender}/{patientName}")
  public Result calculateTotals(@PathVariable("questionnaireId") String questionnaireId, 
								@PathVariable("ageInMonths") int ageInMonths, 
								@PathVariable("userID") String userID, 
                                @PathVariable("userType") String userType,
								@RequestBody ArrayList<FoodItemInput> userChoices,
								@PathVariable("gender") String gender,
								@PathVariable("patientName") String patientName) {

									
	  LocalDate locDate = java.time.LocalDate.now();
	  String date = locDate.toString();
	  Result result = FFQCalculator.calculateTotals(questionnaireId, userID, userType, date, ageInMonths, userChoices, foodTypeService, gender, patientName);
	  resultsService.create(result);
	  
	  return result;
  }


}
