package edu.fiu.ffqr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.FFQuestionnaire;

@Repository
public interface QuestionnaireRepository extends MongoRepository<FFQuestionnaire, String>{

	FFQuestionnaire findByQuestionnaireID(String questionnaireID);
}



