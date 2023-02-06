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

import edu.fiu.ffqr.models.SysUser;
import edu.fiu.ffqr.service.SysUserService;
//import edu.fiu.ffqr.service.UserService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/sysusers")
public class SysUserController {

    @Autowired
    private SysUserService sysUserService;

    public SysUserController() {
    }

    // Khalid
/*
    @PostMapping("/create")
    public User create(@RequestBody User nr) throws JsonProcessingException {
		
		if(SysUsersService.getSysUserByUserName(nr.getUserName()) != null)
		{
			throw new IllegalArgumentException("System Nutrient Recommendation for nutrient " + nr.getUserName() + " already exists.");			
		}
		else
			return userService.create(nr);
    }
    */
    
    

    @PostMapping("/create")
    public SysUser createSysUsers(@RequestBody SysUser item) throws JsonProcessingException {

        if (sysUserService.getSysUserByUsername(item.getSysUsername()) != null) {
            throw new IllegalArgumentException("System user " + item.getSysUsername() + " already exists.");
		}
		else
			return sysUserService.create(item);
	}
    
  
	
}
