package edu.fiu.ffqr.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.Researcher;
import edu.fiu.ffqr.repositories.ResearcherRepository;

@Service
@Component
public class ResearcherService {

	@Autowired
	private ResearcherRepository researcherRepository;
	
	public List<Researcher> getAll()	{
		return researcherRepository.findAll();
	}
	
	public Researcher getUserByUsername(String username) {
		return researcherRepository.findByUsername(username);
	}
	
	public Researcher getUserByUserId(String userId) {
		return researcherRepository.getByUserId(userId);
	}
	
	public Researcher create(Researcher user) {
		return researcherRepository.save(user);
	}
	
	public void delete(String userName) {
		Researcher fi = researcherRepository.findByUsername(userName);
		researcherRepository.delete(fi);
	}

	public Researcher getAdminBy_id(ObjectId _id) {
		return researcherRepository.getUserBy_id(_id);
	}

	public void deleteById(String userId) {
		Researcher fi = researcherRepository.getByUserId(userId);
		researcherRepository.delete(fi);
	}

	public List<Researcher> findAllByAssignedResearchInstitutionId(String researchInstitutionId) {
		return researcherRepository.findAllByAssignedResearchInstitutionId(researchInstitutionId);
	}

	public void deleteAllByAssignedResearchInstitutionId(String researchInstitutionId) {
		this.researcherRepository.deleteAllByAssignedResearchInstitutionId(researchInstitutionId);
	}
	
}
