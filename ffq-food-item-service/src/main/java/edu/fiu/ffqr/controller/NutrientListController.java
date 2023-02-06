package edu.fiu.ffqr.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import edu.fiu.ffqr.models.NutrientList;
import edu.fiu.ffqr.service.NutrientListService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/nutrients")
public class NutrientListController {
			
	@Autowired
	private NutrientListService nutrientListService;
	  
    public NutrientListController() {}
	  
    //dariana
    @PutMapping("")
	public NutrientList saveNutrientLists(@RequestBody NutrientList newNutrientList) throws JsonProcessingException {
		return nutrientListService.update(newNutrientList);
		
	}
    
	@GetMapping("/nutrientlists")
	public List<NutrientList> getAllNutrientLists() throws JsonProcessingException {
		List<NutrientList> foods = nutrientListService.getAll();
		return foods;
	}
	 
	@GetMapping("/{nutrientListID}")
	public NutrientList getItemWithName(@PathVariable("nutrientListID") String nutrientListID) throws JsonProcessingException {
		NutrientList target = nutrientListService.getWithNutrientListID(nutrientListID); 
		return target;
	}
	
	@PostMapping("/create")
	public NutrientList create(@RequestBody NutrientList newNutrientList) {
		//check NutrientListID is  not null
		if(newNutrientList.getNutrientListID() == null || newNutrientList.getNutrientListID() == "") {
			throw new IllegalArgumentException("NutrientListID cannot be null");
		}
		
		//look for duplicate
		NutrientList duplicate = nutrientListService.getWithNutrientListID(newNutrientList.getNutrientListID());
		if(duplicate != null) {
			throw new IllegalArgumentException("A document with that NutrientListID already exists");
		}
		else {
			//send to service			
			return nutrientListService.create(newNutrientList);
		}
	}
	
	@PostMapping("/createMany")
	public ArrayList<NutrientList> createMany(@RequestBody ArrayList<NutrientList> newNutrientLists) {
		for (NutrientList newNutrientList: newNutrientLists) {
			//check NutrientListID is  not null
			if(newNutrientList.getNutrientListID() == null) {
				throw new IllegalArgumentException("NutrientListID cannot be null");
			}
			
			//look for duplicate
			NutrientList duplicate = nutrientListService.getWithNutrientListID(newNutrientList.getNutrientListID());
			if(duplicate != null) {
				throw new IllegalArgumentException("A document with the " + duplicate.getNutrientListID() + " NutrientListID already exists");
			}
			else {
				//send to service			
				nutrientListService.create(newNutrientList);
			}
		}
		return newNutrientLists;
	}
	
}
