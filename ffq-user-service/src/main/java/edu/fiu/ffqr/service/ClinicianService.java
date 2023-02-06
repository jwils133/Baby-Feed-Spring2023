package edu.fiu.ffqr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.Clinician;
import edu.fiu.ffqr.repositories.ClinicianRepository;

import java.util.List;

@Service
@Component
public class ClinicianService  extends UserService<Clinician, ClinicianRepository> {

	@Autowired
	public ClinicianService(ClinicianRepository repository) {
		this.repository = repository;
	}

	public List<Clinician> findAllByAssignedClinic(String assignedclinic) {
		return this.repository.findAllByAssignedclinic(assignedclinic);
	};

	public void deleteAllByAssignedClinic(String assignedclinic) {
		this.repository.deleteAllByAssignedclinic(assignedclinic);
	}

}
