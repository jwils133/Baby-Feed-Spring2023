package edu.fiu.ffqr.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.fiu.ffqr.models.FFQuestionnaire;
import edu.fiu.ffqr.models.QuestionnaireValidationResponse;
import edu.fiu.ffqr.service.QuestionnaireService;

@RestController
@CrossOrigin(origins = "*")
public class QuestionnaireController {

	@Autowired
	private QuestionnaireService qService;
	  
	public QuestionnaireController() {}
	  
	@GetMapping("/questionnaires")
	public List<FFQuestionnaire> getAllQuestionnaires() {
		List<FFQuestionnaire> foods = qService.getAll();
		return foods;
	}
	  
	@GetMapping("/{questionnaireID}")
	public FFQuestionnaire getQsWithId(@PathVariable("questionnaireID") String questionnaireID) {
		return qService.getEntryWithId(questionnaireID);
	}
	  
	@PostMapping("/create")
	public FFQuestionnaire create(@RequestBody FFQuestionnaire data) {
		//check for duplicate questionnaire ID
		String questionnaireID = data.getQuestionnaireID();
		String issuerID = data.getIssuerID();
		boolean submitted = data.isSubmitted();
		if (qService.getEntryWithId(questionnaireID) != null) {
			throw new IllegalArgumentException("A record with that name already exists");
		}
		FFQuestionnaire newQuestionnaire = qService.create(questionnaireID, issuerID, submitted);
		return newQuestionnaire;
	}
	
	@GetMapping("/validate/{questionnaireID}")
	public ResponseEntity<QuestionnaireValidationResponse> validateQuestionnaireID(@PathVariable String questionnaireID) {
		FFQuestionnaire q = qService.getEntryWithId(questionnaireID);
		QuestionnaireValidationResponse response = new QuestionnaireValidationResponse(questionnaireID);
		if (q != null) {
			response.setExists(true);
			response.setSubmitted(q.isSubmitted());
			response.setIssuerId(q.getIssuerID());
		}		
		return new ResponseEntity(response, HttpStatus.OK);
	}
	
	@PostMapping("/createMany")
	public ArrayList<FFQuestionnaire> create(@RequestBody ArrayList<FFQuestionnaire> questionnaires) {
		FFQuestionnaire questionnaire = null;
		
		for(FFQuestionnaire s : questionnaires)
		{
			questionnaire = qService.create(s.getQuestionnaireID(), s.getIssuerID(), s.isSubmitted());
		}
		
		return questionnaires;
	}
	
	  
	  @PutMapping("/update")
	  public FFQuestionnaire update(@RequestBody FFQuestionnaire data) {
		  String id = data.getQuestionnaireID();
		  
		  if (null == id) {
			  throw new IllegalArgumentException("Missing questionnaireID");
		  }
		  
		  FFQuestionnaire questionnaire = qService.getEntryWithId(id);
		  if (null == questionnaire) {
			  throw new IllegalArgumentException("Invalid questionnaireID");
		  }
		  
		  if (data.getIssuerID() != null) {
			  questionnaire.setIssuerID(data.getIssuerID());
		  }
		  
		  if(data.getDate() != null) {
			  questionnaire.setDate(data.getDate());
		  }
			  
		  questionnaire.setSubmitted(data.isSubmitted());

		  qService.update(questionnaire);
		  return questionnaire;
	  }
	  
	  @DeleteMapping("/delete")
	  public String delete(@RequestParam String questionnaireID) {
	      qService.delete(questionnaireID);
	  	  return "Deleted " + questionnaireID;
	  }
//	}
}
