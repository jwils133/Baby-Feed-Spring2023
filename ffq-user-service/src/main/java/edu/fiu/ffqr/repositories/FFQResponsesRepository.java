package edu.fiu.ffqr.repositories;

import edu.fiu.ffqr.models.Result;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FFQResponsesRepository extends MongoRepository<Result, String> {

	Result findByQuestionnaireId(String questionnaireId);

	List<Result> findByUserId(String userId);

	List<Result> findByUserType(String userType);

    void delete(Result fi);

	List<Result> deleteByUserId(String userId);
 
}
