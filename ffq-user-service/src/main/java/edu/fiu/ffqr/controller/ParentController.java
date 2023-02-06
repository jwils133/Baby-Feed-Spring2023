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

import edu.fiu.ffqr.repositories.ParentRepository;
//import edu.fiu.ffqr.service.UserService;
import edu.fiu.ffqr.models.Parent;
import edu.fiu.ffqr.service.ParentService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/parents")
public class ParentController {

    @Autowired
    private ParentService parentService;
    @Autowired
    private ParentRepository parentRepository;

    public ParentController() {
    }

    @GetMapping("/all")
    public List<Parent> allClinicians() throws JsonProcessingException {

        List<Parent> users = parentService.getAll();
        return users;
    }

    @GetMapping("/{userID}")
    public Parent getParent(@PathVariable("userID") String userId) {
        return parentService.getUserByUserIdNoPassword(userId);
    }

    @PostMapping("/createparent")
    public Parent createUser(@RequestBody Parent user) throws JsonProcessingException {

        if (parentService.getUserByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " already exists");
        }
        return parentService.create(user);
    }

    @PutMapping("/updateparent")
    public void updateUser(@RequestBody Parent user) throws JsonProcessingException {

        if (parentService.getUserByUserId(user.getUserId()) == null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " doesn't exist");
        }

        Parent currentUser = parentService.getUserByUserId(user.getUserId());

        currentUser.setAssignedclinic(user.getAssignedclinic());
        currentUser.setAssignedclinician(user.getAssignedclinician());
        currentUser.setChildrenNames(user.getChildrenNames());
        currentUser.setPrefix(user.getPrefix());
        currentUser.setChildren(user.getChildren());

        parentService.update(currentUser, user);
    }

    @PostMapping("/create")
    public Parent create(@RequestBody Parent item) throws JsonProcessingException {

        if (parentService.getUserByUsername(item.getUsername()) != null) {
            throw new IllegalArgumentException("A parent with Username " + item.getUsername() + " already exists");
        }

        return parentService.create(item);
    }

    @PostMapping("/createManyParents")
    public ArrayList<Parent> create(@RequestBody ArrayList<Parent> users) {
        Parent user = null;

        for (Parent s : users) {
            user = parentService.create(s);
        }

        return users;
    }

    @PutMapping("/updaterecommend")
    public Parent updateRecommend(@RequestBody Parent data) throws JsonProcessingException {
        // Get parent's ID
        String userId = data.getUserId();

        // Make sure ID exists
        if (null == userId) {
            throw new IllegalArgumentException("Missing Parent user ID");
        }

        // Get parent with that userID
        Parent parentItem = parentService.findByuserId(userId);
        // Make sure parent with given ID exists
        if (null == parentItem) {
            throw new IllegalArgumentException("Invalid parent user ID");
        }

        if (data.getRecommendTime() != null) {
            parentItem.setRecommendTime(data.getRecommendTime());
        }
        // everything a parent clicks submit read-recommend button, times plus one
        parentItem.setTimesOfReading(parentItem.getTimesOfReading() + 1);
        parentService.update(parentItem);

        return parentItem;
    }


    @DeleteMapping("/delete")
    public String delete(@RequestParam String userId) {
        parentService.deleteById(userId);
        return "Deleted " + userId;
    }


}
