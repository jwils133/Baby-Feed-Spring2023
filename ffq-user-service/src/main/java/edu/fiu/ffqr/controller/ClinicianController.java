package edu.fiu.ffqr.controller;

import java.util.ArrayList;
import java.util.List;

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

import edu.fiu.ffqr.models.Clinician;
import edu.fiu.ffqr.repositories.ClinicianRepository;
//import edu.fiu.ffqr.service.UserService;
import edu.fiu.ffqr.service.ClinicianService;
import edu.fiu.ffqr.service.ParentService;
import edu.fiu.ffqr.service.ResultsService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/clinicians")
public class ClinicianController{

    @Autowired
    private ClinicianService clinicianService;
    @Autowired
    private ClinicianRepository clinicianRepository;
    @Autowired
     private ParentService parentService;
    @Autowired
    private ResultsService resultsService;

    public ClinicianController() {
    }
    
    @GetMapping("/all")
    public List<Clinician> allClinicians() throws JsonProcessingException {
        
        List<Clinician> users = clinicianService.getAll();
        return users;
    }  

    @GetMapping("/{userID}")
	public Clinician getClinician(@PathVariable("userID") String userId) {
		return clinicianService.getUserByUserIdNoPassword(userId);
	}
    
    @PostMapping("/createclinician")
    public Clinician createUser(@RequestBody Clinician user) throws JsonProcessingException {

      if (clinicianService.getUserByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " already exists");
      }  
	  return clinicianService.create(user);
	  
  }

    @PutMapping("/updateclinician")
    public void updateUser(@RequestBody Clinician updatedUser) throws JsonProcessingException {
        
        if (clinicianService.getUserByUserId(updatedUser.getUserId()) == null) {
            throw new IllegalArgumentException("A user with Username " + updatedUser.getUsername() + " doesn't exist");
        }

        Clinician currentUser = clinicianService.getUserByUserId(updatedUser.getUserId());

        currentUser.setAbbreviation(updatedUser.getAbbreviation());
        currentUser.setAssignedclinic(updatedUser.getAssignedclinic());
        currentUser.setPreviousclinic(updatedUser.getPreviousclinics());
        currentUser.setParentLimitForClinician(updatedUser.getParentLimitForClinician());
        currentUser.setPrefix(updatedUser.getPrefix());

        clinicianService.update(currentUser, updatedUser);
    }


    @PostMapping("/create")
    public Clinician create(@RequestBody Clinician item) throws JsonProcessingException {
        
        if (clinicianService.getUserByUserId(item.getUsername()) != null) {
            throw new IllegalArgumentException("A clinician with Username " + item.getUsername() + " already exists");
        }

        return clinicianService.create(item);
    }

	@PostMapping("/createManyClinicians")
	public ArrayList<Clinician> create(@RequestBody ArrayList<Clinician> users) {
		Clinician user = null;
		ArrayList<Clinician> createdUsers = new ArrayList<>();
		
		for(Clinician clinician : users)
		{
			createdUsers.add(clinicianService.create(clinician));
		}
		
		return createdUsers;
	}

	@DeleteMapping("/delete")
    public String delete(@RequestParam String userId) {

        parentService.findAllByAssignedclinician(userId)
            .forEach(parent ->
                resultsService.deleteResultsByUserId(parent.getUserId())
                );
        parentService.deleteByAssignedclinician(userId);
                            
        clinicianService.deleteById(userId);
	  	return "Deleted " + userId;
	}
	
}
