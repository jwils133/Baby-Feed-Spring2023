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

//import edu.fiu.ffqr.service.UserService;
import edu.fiu.ffqr.models.Participant;
import edu.fiu.ffqr.service.ParticipantsService;
import edu.fiu.ffqr.repositories.ParticipantsRepository;
import edu.fiu.ffqr.service.ResultsService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/participant")
public class ParticipantsController {

    @Autowired
    private ParticipantsService participantsService;
    @Autowired
    private ParticipantsRepository participantRepository;
    @Autowired
    private ResultsService resultsService;

    public ParticipantsController() {
    }

    @GetMapping("/all")
    public List<Participant> allParticipants() throws JsonProcessingException {
        List<Participant> users = participantsService.getAll();
        return users;
    }

    @GetMapping("/all/{instID}")
    public List<Participant> allResearcherParticipants(@PathVariable("instID") String instID) {
        List<Participant> users = participantsService.findAllByAssignedResearcherInst(instID);
        return users;
    }

    @GetMapping("/{userID}")
    public Participant getParticipant(@PathVariable("userID") String userId) {
        return participantsService.getUserByUserIdNoPassword(userId);
    }

    @PostMapping("/createparticipant")
    public Participant createUser(@RequestBody Participant user) throws JsonProcessingException {

        if (participantsService.getUserByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " already exists");
        }
        return participantsService.create(user);

    }

    @PutMapping("/updateparticipant")
    public void updateUser(@RequestBody Participant user) throws JsonProcessingException {

        if (participantsService.getUserByUserId(user.getUserId()) == null) {
            throw new IllegalArgumentException("A user with Username " + user.getUsername() + " doesn't exist");
        }

        Participant currentUser = participantsService.getUserByUserId(user.getUserId());

        currentUser.setAssignedResearcherInst(user.getAssignedResearcherInst());
        currentUser.setAssignedResearcherUser(user.getAssignedResearcherUser());
        currentUser.setChildrennames(user.getChildrennames());
        currentUser.setChildren(user.getChildren());
        currentUser.setPrefix(user.getPrefix());

        participantsService.update(currentUser, user);
    }

    @PostMapping("/create")
    public Participant create(@RequestBody Participant item) throws JsonProcessingException {

        if (participantsService.getUserByUsername(item.getUsername()) != null) {
            throw new IllegalArgumentException("A participant with Username " + item.getUsername() + " already exists");
        }

        return participantsService.create(item);
    }

    @PostMapping("/createManyParticipants")
    public ArrayList<Participant> create(@RequestBody ArrayList<Participant> users) {
        Participant user = null;

        for (Participant s : users) {
            user = participantsService.create(s);
        }

        return users;
    }

    @DeleteMapping("/delete")
    public String delete(@RequestParam String userId) {
        resultsService.deleteResultsByUserId(userId);
        participantsService.deleteById(userId);
        return "Deleted " + userId;
    }
}
