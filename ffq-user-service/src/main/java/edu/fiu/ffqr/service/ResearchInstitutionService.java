package edu.fiu.ffqr.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.SysUser;
import edu.fiu.ffqr.models.Admin;
import edu.fiu.ffqr.models.ResearchInstitution;
import edu.fiu.ffqr.repositories.AdminRepository;
import edu.fiu.ffqr.repositories.ResearchInstitutionRepository;

@Service
@Component
public class ResearchInstitutionService {

	@Autowired
	private ResearchInstitutionRepository researchRepository;
	
	public List<ResearchInstitution> getAll()	{
		return researchRepository.findAll();
	}
	
	public ResearchInstitution getUserByInstitutionName(String institutionName) {
		return researchRepository.findByInstitutionName(institutionName);
	}
	
	public ResearchInstitution getResearchInstitutionById(String researchInstitutionId) {
		return researchRepository.getByResearchInstitutionId(researchInstitutionId);
	}
	
	public ResearchInstitution create(ResearchInstitution item) {
		return researchRepository.save(item);
	}
	
	public void delete(String institutionName) {
		ResearchInstitution fi = researchRepository.findByInstitutionName(institutionName);
		researchRepository.delete(fi);
	}

	public ResearchInstitution getAdminBy_id(ObjectId _id) {
		return researchRepository.getObjectBy_id(_id);
	}

	public void deleteById(String institutionId) {
		ResearchInstitution fi = researchRepository.getByResearchInstitutionId(institutionId);
		researchRepository.delete(fi);
	}
	
}
