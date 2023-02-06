package edu.fiu.ffqr.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

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
import edu.fiu.ffqr.models.Researcher;
import edu.fiu.ffqr.repositories.ResearcherRepository;
import edu.fiu.ffqr.service.ResearcherService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/researchers")
public class ResearchController {

    @Autowired
    private ResearcherService researchService;
    @Autowired
    private ResearcherRepository researcherRepository;

    public ResearchController() {
    }

    @GetMapping(produces = "application/json")
	@RequestMapping({ "/validateLogin" })
	public Authenticate validateLogin() {
		return new Authenticate("User successfully authenticated");
	}
    
    
    @GetMapping("/all")
    public List<Researcher> allUsers() throws JsonProcessingException {
        
        List<Researcher> users = researchService.getAll();
        return users;
    }  

    @GetMapping("/{userID}")
	public Researcher gUserApplication(@PathVariable("userID") String userID) {
		return researchService.getUserByUserId(userID);
	}
    
    @PostMapping("/createuser")
    public Researcher createUser(@RequestBody Researcher user) throws JsonProcessingException {

      if (researchService.getUserByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " already exists");
      }  
	  return researchService.create(user);
	  
  }
    
    @PostMapping("/create")
    public Researcher create(@RequestBody Researcher item) throws JsonProcessingException {
        
        if (researchService.getUserByUsername(item.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + item.getUsername() + " already exists");
        }

        return researchService.create(item);
    }


  @PutMapping("/updateuser")
    public void updateUser(@RequestBody Researcher user) throws JsonProcessingException {
        
        if (researchService.getUserByUserId(user.getUserId()) == null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " doesn't exist");
        }

        Researcher currentUser = researchService.getUserByUserId(user.getUserId());

        currentUser.setUsername(user.getUsername());
        currentUser.setUserpassword(user.getUserpassword());
        currentUser.setFirstname(user.getFirstname());
        currentUser.setLastname(user.getLastname());        
        currentUser.setAssignedResearchInstitutionId(user.getAssignedResearchInstitutionId());
        currentUser.setLimitNumberOfParticipants(user.getLimitNumberOfParticipants());
        currentUser.setPrefix(user.getPrefix());

        researcherRepository.save(currentUser);

        //return adminService.create(user);
    }

   
	
	@PostMapping("/createMany")
	public ArrayList<Researcher> create(@RequestBody ArrayList<Researcher> users) {
		Researcher user = null;
		
		for(Researcher s : users)
		{
			user = researchService.create(s);
		}
		
		return users;
	}
	
	  
	  
	  @DeleteMapping("/delete")
	  public String delete(@RequestParam String userId) {
        researchService.deleteById(userId);
	  	  return "Deleted " + userId;
      }
      
    @RequestMapping("/login")
    public boolean login(@RequestBody Researcher user) {
        return
          user.getUsername().equals("user") && user.getUserpassword().equals("password");
    }
     
    @RequestMapping("/user")
    public Principal user(HttpServletRequest request) {
        String authToken = request.getHeader("Authorization")
          .substring("Basic".length()).trim();
        return () ->  new String(Base64.getDecoder()
          .decode(authToken)).split(":")[0];
    }
	
}
