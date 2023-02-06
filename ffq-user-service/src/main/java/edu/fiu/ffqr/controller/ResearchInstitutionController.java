package edu.fiu.ffqr.controller;

import java.util.ArrayList;
import java.util.List;

import edu.fiu.ffqr.service.ParticipantsService;
import edu.fiu.ffqr.service.ResearcherService;
import edu.fiu.ffqr.service.ResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import edu.fiu.ffqr.models.Authenticate;
import edu.fiu.ffqr.models.ResearchInstitution;
import edu.fiu.ffqr.repositories.ResearchInstitutionRepository;
import edu.fiu.ffqr.service.ResearchInstitutionService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/research_institution")
public class ResearchInstitutionController {

    @Autowired
    private ResearchInstitutionService researchInstitutionService;
    @Autowired
    private ResearcherService researcherService;
    @Autowired
    private ParticipantsService participantsService;
    @Autowired
    private ResultsService resultsService;
    @Autowired
    private ResearchInstitutionRepository researchRepository;

    public ResearchInstitutionController() {
    }

    @GetMapping(produces = "application/json")
	@RequestMapping({ "/validateLogin" })
	public Authenticate validateLogin() {
		return new Authenticate("User successfully authenticated");
	}
    
    
    @GetMapping("/all")
    public List<ResearchInstitution> allUsers() throws JsonProcessingException {
        
        List<ResearchInstitution> users = researchInstitutionService.getAll();
        return users;
    }  

    @GetMapping("/{institutionID}")
	public ResearchInstitution getResearchInstitutionById(@PathVariable("institutionID") String userID) {
		return researchInstitutionService.getResearchInstitutionById(userID);
	}
    
         @GetMapping("/name/{institutionName}")
	public ResearchInstitution getResearchInstitutionByName(@PathVariable("institutionName") String institutionName) {
		return researchInstitutionService.getUserByInstitutionName(institutionName);
	}
        
    @PostMapping("/createInstitution")
    public ResearchInstitution createUser(@RequestBody ResearchInstitution user) throws JsonProcessingException {

      if (researchInstitutionService.getUserByInstitutionName(user.GetInstitutionName()) != null) {
            throw new IllegalArgumentException("A research Institution with name " + user.GetInstitutionName() + " already exists");
      }  
	  return researchInstitutionService.create(user);
	  
  }

  @PutMapping("/updateinstitution")
    public void updateUser(@RequestBody ResearchInstitution updatedUser) throws JsonProcessingException {
        
        if (researchInstitutionService.getResearchInstitutionById(updatedUser.getResearchInstitutionId()) == null) {
            throw new IllegalArgumentException("A research Institution with name " + updatedUser.GetInstitutionName()+ " doesn't exist");
        }

        ResearchInstitution currentUser = researchInstitutionService.getResearchInstitutionById(updatedUser.getResearchInstitutionId());

        currentUser.setAddress(updatedUser.getAddress());
        currentUser.setCreatedDate(updatedUser.getCreatedDate());
        currentUser.setInstitutionName(updatedUser.GetInstitutionName());
        currentUser.setSiteType(updatedUser.getSiteType());
        currentUser.setParticipantsLimit(updatedUser.getParticipantsLimit());

        researchRepository.save(currentUser);
       
    }
    

    @PostMapping("/create")
    public ResearchInstitution create(@RequestBody ResearchInstitution item) throws JsonProcessingException {
        
        if (researchInstitutionService.getUserByInstitutionName(item.GetInstitutionName()) != null) {
            throw new IllegalArgumentException("A research Institution with name " + item.GetInstitutionName()+ " already exists");
        }

        return researchInstitutionService.create(item);
    }

    
    
   
	
	@PostMapping("/createMany")
	public ArrayList<ResearchInstitution> create(@RequestBody ArrayList<ResearchInstitution> researchInstitutions) {
		ResearchInstitution institution = null;
		
		for(ResearchInstitution researchInstitution : researchInstitutions)
		{
			institution = researchInstitutionService.create(researchInstitution);
		}
		
		return researchInstitutions;
	}
	
	  
	  
	  @DeleteMapping("/delete")
	  public String delete(@RequestParam String researchInstitutionId) {
          researcherService.findAllByAssignedResearchInstitutionId(researchInstitutionId)
                  .forEach(researcher -> {
                              participantsService.findAllByAssignedResearcherInst(researcher.getUserId())
                                      .forEach(participant ->
                                              resultsService.deleteResultsByUserId(participant.getUserId())
                                      );
                              participantsService.deleteAllByAssignedResearcherInst(researcher.getUserId());
                          }
                  );
          researcherService.deleteAllByAssignedResearchInstitutionId(researchInstitutionId);
          researchInstitutionService.deleteById(researchInstitutionId);
	  	  return "Deleted " + researchInstitutionId;
      }
	
}
