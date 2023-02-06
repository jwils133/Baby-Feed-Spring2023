package edu.fiu.ffqr.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import edu.fiu.ffqr.models.Result;
import edu.fiu.ffqr.service.ResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Author: Dariana Gonzalez
 * Created: 09/2019
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/results")
public class ResultController {
	
	@Autowired
	private ResultsService resultsService;
	
	public ResultController() {}

	@GetMapping("/all")
	public List<Result> getAllResults() throws JsonProcessingException {
		List<Result> results = resultsService.getAll();
		return results;
	}

	@GetMapping("/type/{userType}")
	public List<Result> findByUserType(@PathVariable("userType") String userType) throws JsonProcessingException {
		List<Result> results = resultsService.findByUserType(userType);
		return results;
	}

	@GetMapping("/parent/{userID}")
	public List<Result> getResultsByUserId(@PathVariable("userID") String userId) throws JsonProcessingException {
		List<Result> results = resultsService.getResultsByUserId(userId);
		return results;
	}

	@DeleteMapping("/delete")
	public String delete(@RequestParam(required = false) String questionnaireId, @RequestParam(required = false) String parentId) {
		if (questionnaireId != null) {
			resultsService.delete(questionnaireId);
			return "Deleted " + questionnaireId;
		} else if (parentId != null) {
			resultsService.deleteResultsByUserId(parentId);
			return "Deleted all questionaries for parent Id " + parentId;
		}
		return "Did not delete anything. Provide questionnaireId or parentId";
	}

	@PutMapping("/update")
	public Result update(@RequestBody Result data) {

		System.out.println(data.toString());

		String id = data.getQuestionnaireId();

		if (null == id) {
			throw new IllegalArgumentException("Missing questionnaireID");
		}

		Result questionnaireResult = resultsService.getResultByQuestionnaireID(id);
		if (null == questionnaireResult) {
			throw new IllegalArgumentException("Invalid questionnaireID");
		}

		if(data.getFeedback() != null) {
			questionnaireResult.setFeedback(data.getFeedback());
		}

		resultsService.update(questionnaireResult);

		return questionnaireResult;
	}
}
