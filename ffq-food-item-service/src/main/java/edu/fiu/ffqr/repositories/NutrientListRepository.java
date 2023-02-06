package edu.fiu.ffqr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.NutrientList;

@Repository
public interface NutrientListRepository extends MongoRepository<NutrientList, String> {
	
	NutrientList findByNutrientListID(String name);
}
