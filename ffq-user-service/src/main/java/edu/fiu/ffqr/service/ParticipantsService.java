package edu.fiu.ffqr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.repositories.ParticipantsRepository;
import edu.fiu.ffqr.models.Participant;

@Service
@Component
public class ParticipantsService extends UserService<Participant, ParticipantsRepository> {

	@Autowired
	public ParticipantsService(ParticipantsRepository repository) {
		this.repository = repository;
	}

	public List<Participant> findAllByAssignedResearcherInst(String assignedResearcherInst) {
		return repository.findByAssignedResearcherInst(assignedResearcherInst);
	}

	public void deleteAllByAssignedResearcherInst(String researcherInst) {
		this.repository.deleteAllByAssignedResearcherInst(researcherInst);
	}
}
