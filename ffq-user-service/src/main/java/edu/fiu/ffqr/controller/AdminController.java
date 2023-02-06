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

import edu.fiu.ffqr.FFQUserApplication;
import edu.fiu.ffqr.models.Authenticate;
import edu.fiu.ffqr.models.SysUser;
import edu.fiu.ffqr.repositories.AdminRepository;
import edu.fiu.ffqr.models.Admin;
import edu.fiu.ffqr.service.SysUserService;
import edu.fiu.ffqr.service.AdminService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private AdminRepository adminRepository;

    public AdminController() {
    }

    @GetMapping(produces = "application/json")
	@RequestMapping({ "/validateLogin" })
	public Authenticate validateLogin() {
		return new Authenticate("User successfully authenticated");
	}
    
    
    @GetMapping("/all")
    public List<Admin> allUsers() throws JsonProcessingException {
        
        List<Admin> users = adminService.getAll();
        return users;
    }  

    @GetMapping("/{userID}")
	public Admin gUserApplication(@PathVariable("userID") String userID) {
		return adminService.getUserByUserId(userID);
	}
    
    @PostMapping("/createuser")
    public Admin createUser(@RequestBody Admin user) throws JsonProcessingException {

      if (adminService.getUserByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " already exists");
      }  
	  return adminService.create(user);
	  
  }

  @PostMapping("/updateuser")
    public void updateUser(@RequestBody Admin user) throws JsonProcessingException {
        
        if (adminService.getUserByUserId(user.getUserId()) == null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " doesn't exist");
        }

        Admin currentUser = adminService.getUserByUserId(user.getUserId());

        currentUser.setUsername(user.getUsername());
        currentUser.setUserpassword(user.getUserpassword());
        currentUser.setFirstname(user.getFirstname());
        currentUser.setLastname(user.getLastname());
        currentUser.setUsertype(user.getUsertype());

        adminRepository.save(currentUser);

        //return adminService.create(user);
    }


    @PostMapping("/create")
    public Admin create(@RequestBody Admin item) throws JsonProcessingException {
        
        if (adminService.getUserByUsername(item.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + item.getUsername() + " already exists");
        }

        return adminService.create(item);
    }

    
    
   
	
	@PostMapping("/createMany")
	public ArrayList<Admin> create(@RequestBody ArrayList<Admin> users) {
		Admin user = null;
		
		for(Admin s : users)
		{
			user = adminService.create(s);
		}
		
		return users;
	}
	
	  
	  
	  @DeleteMapping("/delete")
	  public String delete(@RequestParam String userId) {
        adminService.deleteById(userId);
	  	  return "Deleted " + userId;
      }
      
    @RequestMapping("/login")
    public boolean login(@RequestBody Admin user) {
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
