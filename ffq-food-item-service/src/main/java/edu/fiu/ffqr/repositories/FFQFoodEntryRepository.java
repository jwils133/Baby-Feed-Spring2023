package edu.fiu.ffqr.repositories;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import edu.fiu.ffqr.models.FoodItem;
import java.util.List;

public interface FFQFoodEntryRepository extends MongoRepository<FoodItem, String> {
	
  FoodItem findByNameAndActiveIsTrue(String name);
  
  FoodItem getFoodItemBy_idAndActiveIsTrue(ObjectId _id);
  
  @Query(value = "{ 'foodTypes.nutrientListID' : ?0 }", fields = "{ 'foodTypes.nutrientListID' : 0 }")
  FoodItem findByNutrientIdAndActiveIsTrue(String nutrientListID);
//FoodItem findByNutrientId(String nutrientListID);
   List<FoodItem> findByActiveIsTrue();
}