package edu.fiu.ffqr.service;

import edu.fiu.ffqr.models.Result;
import edu.fiu.ffqr.repositories.FFQResponsesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Component
public class ResultsService {

	@Autowired
	private FFQResponsesRepository responsesRepository;
	
	public List<Result> getAll() {
		return responsesRepository.findAll();
	}

	public List<Result> findByUserType(String userType) {
		return responsesRepository.findByUserType(userType);
	}

	public List<Result> getResultsByUserId(String userId) {
		return responsesRepository.findByUserId(userId);
	}

	public List<Result> deleteResultsByUserId(String userId) {
		return responsesRepository.deleteByUserId(userId);
	}
	
	public Result create(Result results) {		
		return responsesRepository.save(results);
	}
	
    public Result getResultByQuestionnaireID(String questionnaireId) {
    	return responsesRepository.findByQuestionnaireId(questionnaireId);
    }

	public Result update(Result updatedItem) {
		return responsesRepository.save(updatedItem);
	}

	public void delete(String questionnaireId) {
		Result questionnaireResult = getResultByQuestionnaireID(questionnaireId);
		responsesRepository.delete(questionnaireResult);
	}
}
