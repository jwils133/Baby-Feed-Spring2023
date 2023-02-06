package edu.fiu.ffqr.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.SysUser;
import edu.fiu.ffqr.models.Clinic;
import edu.fiu.ffqr.models.Clinician;
import edu.fiu.ffqr.repositories.ClinicRepository;
import edu.fiu.ffqr.repositories.ClinicianRepository;

@Service
@Component
public class ClinicService {

	@Autowired
	private ClinicRepository clinicRepository;
	
	public List<Clinic> getAll()	{
		return clinicRepository.findAll();
	}
	
	public Clinic getClinicBy_id(ObjectId _id) {
		return clinicRepository.getClinicBy_id(_id);
	}

	public Clinic getClinicByClinicId(String clinicId) {
		return clinicRepository.getByClinicId(clinicId);
	}

	public Clinic getClinicByClinicname(String clininame) {
		return clinicRepository.getByClinicname(clininame);
	}

	public Clinic getClinicByIsactive(boolean isactive) {
		return clinicRepository.getByIsactive(isactive);
	}

	public Clinic create(Clinic clinic) {
		return clinicRepository.save(clinic);
	}

	public void delete(String clinicId) {
		Clinic fi = clinicRepository.getByClinicId(clinicId);
		clinicRepository.delete(fi);
	}

	public void deleteById(String clinicId) {
		Clinic fi = clinicRepository.getByClinicId(clinicId);
		clinicRepository.delete(fi);
	}
	
}
