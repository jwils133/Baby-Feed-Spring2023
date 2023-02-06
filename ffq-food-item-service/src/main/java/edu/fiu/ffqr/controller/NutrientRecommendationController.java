package edu.fiu.ffqr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import edu.fiu.ffqr.models.NutrientRecommendation;
import edu.fiu.ffqr.models.Recommendation;
import edu.fiu.ffqr.models.Result;
import edu.fiu.ffqr.models.SysNutrientRecommendation;
import edu.fiu.ffqr.service.ResultsService;
import edu.fiu.ffqr.service.SysNutrientRecommendationService;

/*
 * Author: Dariana Gonzalez
 * Created: 10/2019
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/nutrientsrecommendations")
public class NutrientRecommendationController {

	@Autowired
	private SysNutrientRecommendationService SysNutRecomService;

	@Autowired
	private ResultsService resultsService;

	public NutrientRecommendationController() {
	}

	// return all the system nutrient recommendations
	@GetMapping("/all")
	public List<SysNutrientRecommendation> getAllResults() throws JsonProcessingException {
		List<SysNutrientRecommendation> SysNutrientsRecommendations = SysNutRecomService.getAll();
		return SysNutrientsRecommendations;
	}

	// @GetMapping("/calculate/{questionnaireID}")
	// public NutrientRecommendation
	// calculateNutrientsRecommendations(@PathVariable("questionnaireID") String
	// questionnaireID) throws Exception {
	//
	// String ageRange = "";
	// String status = "";
	//
	// Result result = resultsService.getResultByQuestionnaireID(questionnaireID);
	// int patientAge = result.getAgeInMonths();
	// String patientName = result.getPatientName();
	// Map<String, Double> map = result.getDailyAverages();
	//
	// // get list of nutrients recommendations by age
	// List<SysNutrientRecommendation> SysNutrientsRecommendations =
	// SysNutRecomService.getAll();
	//
	// if(patientAge >= 0 && patientAge <= 6)
	// {
	// ageRange = "0-6";
	// }
	// else if(patientAge >= 7 && patientAge <= 12)
	// {
	// ageRange = "7-12";
	// }
	// else if(patientAge >= 13 && patientAge <= 24)
	// {
	// ageRange = "13-24";
	// }
	// else
	// throw new Exception("There are no recommendations available for infants of
	// age over 24 months");
	//
	// NutrientRecommendation nRecommendation = new NutrientRecommendation();
	// nRecommendation.setPatientAgeInMonths(patientAge);
	// nRecommendation.setPatientName(patientName);
	// nRecommendation.setQuestionnaireId(questionnaireID);
	//
	// for (SysNutrientRecommendation n: SysNutrientsRecommendations) {
	//
	// double calculatedValue = map.get(n.getNutrientName());
	// double recommendedValue = n.getEstimatedAverageByAge().get(ageRange);
	// double percentageOfRecommended = Math.round((calculatedValue * 100 /
	// recommendedValue) * 100.0 ) / 100.0;
	//
	// if(calculatedValue < recommendedValue - (recommendedValue * 0.10)) {
	// System.out.println(calculatedValue);
	// System.out.println(recommendedValue);
	// status = "Below (" + percentageOfRecommended + "%)";
	// }
	// else if(calculatedValue > recommendedValue + (recommendedValue * 0.10)) {
	// status = "Above (" + percentageOfRecommended + "%)";
	// }
	// else
	// status = "Normal (" + percentageOfRecommended + "%)";
	//
	// Recommendation recommedation = new Recommendation();
	// recommedation.setCalculatedAmount(calculatedValue);
	// recommedation.setRecommendedAmount(recommendedValue);
	// recommedation.setNutrientName(n.getNutrientName());
	// recommedation.setStatus(status);
	//
	// nRecommendation.getRecommendationsList().add(recommedation);
	// }
	//
	// return nRecommendation;
	// }

	@GetMapping("/calculate/{questionnaireID}")
	public NutrientRecommendation calculateNutrientsRecommendations(
			@PathVariable("questionnaireID") String questionnaireID) throws Exception {

		String ageRange;
		String status;

		Result result = resultsService.getResultByQuestionnaireID(questionnaireID);
		int patientAge = result.getAgeInMonths();
		String gender = result.getGender();
		String energyKcal = "Energy (kcal)";
		Map<String, Double> map = result.getDailyAverages();

		List<SysNutrientRecommendation> SysNutrientsRecommendations = SysNutRecomService.getAll();
		//
		if ((patientAge >= 0) && (patientAge <= 6)) {
			ageRange = "0-6";
		} else if ((patientAge >= 7) && (patientAge <= 12)) {
			ageRange = "7-12";
		} else if ((patientAge >= 13) && (patientAge <= 24)) {
			ageRange = "13-24";
		} else {
			throw new Exception("There are no recommendations available for infants of age over 24 months");
		}

		NutrientRecommendation nutrientRecommendation = new NutrientRecommendation();
		nutrientRecommendation.setPatientAgeInMonths(patientAge);
		nutrientRecommendation.setQuestionnaireId(questionnaireID);

		for (int i = 0; i < SysNutrientsRecommendations.size(); i++) {
			SysNutrientRecommendation n = SysNutrientsRecommendations.get(i);

			String nutrientName = n.getNutrientName();
			double recommendedValue = n.getEstimatedAverageByAge().get(ageRange);

			if(nutrientName.equals(energyKcal)) {
				recommendedValue = 0;
				if(gender.equals("male")) {
					if(patientAge == 1) {
						recommendedValue = 472;
					} else if(patientAge == 2) {
						recommendedValue = 567;
					} else if(patientAge == 3) {
						recommendedValue = 572;
					} else if(patientAge == 4) {
						recommendedValue = 548;
					} else if(patientAge == 5) {
						recommendedValue = 596;
					} else if(patientAge == 6) {
						recommendedValue = 645;
					} else if(patientAge == 7) {
						recommendedValue = 668;
					} else if(patientAge == 8) {
						recommendedValue =710;
					} else if(patientAge == 9) {
						recommendedValue =746;
					} else if(patientAge == 10) {
						recommendedValue =793;
					} else if(patientAge == 11) {
						recommendedValue =817;
					} else if(patientAge == 12 || patientAge == 13 || patientAge == 14) {
						recommendedValue =844;
					} else if(patientAge == 15 || patientAge == 16 || patientAge == 17) {
						recommendedValue =908;
					} else if(patientAge == 18 || patientAge == 19 || patientAge == 20) {
						recommendedValue =961;
					} else if(patientAge == 21 || patientAge == 22 || patientAge == 23) {
						recommendedValue =1006;
					}else if (patientAge == 24)  {
						recommendedValue = 1050;
					}
				}
				else if(gender.equals("female")) {
					if(patientAge == 1) {
						recommendedValue = 438;
					} else if(patientAge == 2) {
						recommendedValue = 500;
					} else if(patientAge == 3) {
						recommendedValue = 521;
					} else if(patientAge == 4) {
						recommendedValue = 508;
					} else if(patientAge == 5) {
						recommendedValue = 553;
					} else if(patientAge == 6) {
						recommendedValue = 593;
					} else if(patientAge == 7) {
						recommendedValue = 608;
					} else if(patientAge == 8) {
						recommendedValue =643;
					} else if(patientAge == 9) {
						recommendedValue =678;
					} else if(patientAge == 10) {
						recommendedValue =717;
					} else if(patientAge == 11) {
						recommendedValue =742;
					} else if(patientAge == 12 || patientAge == 13 || patientAge == 14) {
						recommendedValue =768;
					} else if(patientAge == 15 || patientAge == 16 || patientAge == 17) {
						recommendedValue =837;
					} else if(patientAge == 18 || patientAge == 19 || patientAge == 20) {
						recommendedValue =899;
					} else if(patientAge == 21 || patientAge == 22 || patientAge == 23) {
						recommendedValue =952;
					} else if (patientAge == 24) {
						recommendedValue = 997;
					}
				}
			}

			Recommendation testRecom = new Recommendation();
			testRecom.setNutrientName(nutrientName);
			testRecom.setRecommendedAmount(recommendedValue);
			double calculatedValue;
			double percentageOfRecommended;
			try {
				calculatedValue = map.get(nutrientName);
				testRecom.setCalculatedAmount(calculatedValue);
				percentageOfRecommended = Math.round((calculatedValue * 100.0 / recommendedValue) * 100.0) / 100.0;
			} catch (Exception e) {
				calculatedValue = 0;
				testRecom.setCalculatedAmount(calculatedValue);
				percentageOfRecommended = 0;
			}

			if (calculatedValue < (recommendedValue - (recommendedValue * 0.10))) {
				System.out.println(calculatedValue);
				System.out.println(recommendedValue);
				// status = "Below (" + percentageOfRecommended + "%)";
				status = "Below (";
				status = status.concat(Double.toString(percentageOfRecommended));
				status = status.concat("%)");
			} else if (calculatedValue > (recommendedValue + (recommendedValue * 0.10))) {
				// status = "Above (" + percentageOfRecommended + "%)";
				status = "Above (";
				status = status.concat(Double.toString(percentageOfRecommended));
				status = status.concat("%)");
			} else {
				// status = "Normal (" + percentageOfRecommended + "%)";
				status = "Adequate (";
				status = status.concat(Double.toString(percentageOfRecommended));
				status = status.concat("%)");
			}

			testRecom.setStatus(status);

			List<Recommendation> tempList = nutrientRecommendation.getRecommendationsList();
			tempList.add(testRecom);
			nutrientRecommendation.setRecommendationsList(tempList);
		}

		return nutrientRecommendation;
	}

	@PostMapping("/create")
	public SysNutrientRecommendation create(@RequestBody SysNutrientRecommendation nr) throws JsonProcessingException {

		if (SysNutRecomService.getSysNutrientRecommendationByNutrientName(nr.getNutrientName()) != null) {
			throw new IllegalArgumentException(
					"System Nutrient Recommendation for nutrient " + nr.getNutrientName() + " already exists.");
		} else
			return SysNutRecomService.create(nr);
	}
}
