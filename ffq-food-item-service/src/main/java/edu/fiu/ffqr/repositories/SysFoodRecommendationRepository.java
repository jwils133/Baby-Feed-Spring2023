package edu.fiu.ffqr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.SysFoodRecommendation;

@Repository
public interface SysFoodRecommendationRepository extends MongoRepository<SysFoodRecommendation, String> {

	SysFoodRecommendation findBycategoryName(String categoryName);
}
