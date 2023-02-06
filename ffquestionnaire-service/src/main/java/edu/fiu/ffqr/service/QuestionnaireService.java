package edu.fiu.ffqr.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.FFQuestionnaire;
import edu.fiu.ffqr.repositories.QuestionnaireRepository;

@Service
public class QuestionnaireService {
	
	@Autowired
	private QuestionnaireRepository qRepository;
	
	public List<FFQuestionnaire> getAll()	{
		return qRepository.findAll();
	}
	
	public FFQuestionnaire getEntryWithId(String questionnaireID) {
		return qRepository.findByQuestionnaireID(questionnaireID);
	}
	
	public void delete(String questionnaireID) {
		FFQuestionnaire q = qRepository.findByQuestionnaireID(questionnaireID);
		qRepository.delete(q);
	}
	
	public FFQuestionnaire create(String questionnaireID, String issuerID, boolean submitted) { 
		 FFQuestionnaire q = new FFQuestionnaire(questionnaireID, issuerID);
		 q.setSubmitted(submitted);
		 return qRepository.save(q); 
	}
	
	public FFQuestionnaire update(FFQuestionnaire updatedItem) {
		return qRepository.save(updatedItem);
	}
	
}
