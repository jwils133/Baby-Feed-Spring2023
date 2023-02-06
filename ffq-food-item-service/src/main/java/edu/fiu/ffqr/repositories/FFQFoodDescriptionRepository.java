package edu.fiu.ffqr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.bson.types.ObjectId;

import edu.fiu.ffqr.models.FoodDescription;

@Repository
public interface FFQFoodDescriptionRepository extends MongoRepository<FoodDescription, String> {

  FoodDescription findByFoodItemGroupName(String foodItemGroupName);

  FoodDescription findBy_id(ObjectId _id);

}