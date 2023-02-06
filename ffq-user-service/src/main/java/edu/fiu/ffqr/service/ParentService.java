package edu.fiu.ffqr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.repositories.ParentRepository;
import edu.fiu.ffqr.models.Parent;

import java.util.List;

@Service
@Component
public class ParentService extends UserService<Parent, ParentRepository> {

	@Autowired
	public ParentService(ParentRepository repository) {
		this.repository = repository;
	}

	public List<Parent> findAllByAssignedclinician(String assignedclinician) {
		return this.repository.findAllByAssignedclinician(assignedclinician);
	}

	public void deleteByAssignedclinician(String assignedclinician) {
		this.repository.deleteAllByAssignedclinician(assignedclinician);
	}

	public Parent findByuserId(String userId) {
		return this.repository.findByuserId(userId);
	}

	public Parent update(Parent parent) {
		return this.repository.save(parent);
	}
}
