package edu.fiu.ffqr.controller;

import java.util.ArrayList;
import java.util.List;

import edu.fiu.ffqr.service.ClinicianService;
import edu.fiu.ffqr.service.ParentService;
import edu.fiu.ffqr.service.ResultsService;
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

import edu.fiu.ffqr.models.Clinic;
import edu.fiu.ffqr.repositories.ClinicRepository;
import edu.fiu.ffqr.service.ClinicService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/clinics")
public class ClinicController{

    @Autowired
    private ClinicService clinicService;
    @Autowired
    private ClinicianService clinicianService;
    @Autowired
    private ParentService parentService;
    @Autowired
    private ResultsService resultsService;
    @Autowired
    private ClinicRepository clinicRepository;

    public ClinicController() {
    }
    
    @GetMapping("/all")
    public List<Clinic> allClinics() throws JsonProcessingException {
        
        List<Clinic> clinics = clinicService.getAll();
        return clinics;
    }  

    @GetMapping("/{clinicID}")
	public Clinic getClinic(@PathVariable("clinicID") String clinicId) {
		return clinicService.getClinicByClinicId(clinicId);
    }
    
    @GetMapping("/all/{isActive}")
	public Clinic getActiveClinics(@PathVariable("isActive") boolean isActive) {
		return clinicService.getClinicByIsactive(isActive);
	}
    
    @PostMapping("/createclinic")
    public Clinic createClinic(@RequestBody Clinic clinic) throws JsonProcessingException {

      if (clinicService.getClinicByClinicId(clinic.getClinicId()) != null) {
            throw new IllegalArgumentException("A clinic with the name " + clinic.getClinicname() + " already exists");
      }  
	  return clinicService.create(clinic);
	  
  }

  @PutMapping("/updateclinic")
    public Clinic updateClinic(@RequestBody Clinic clinic) throws JsonProcessingException {
      Clinic currentClinic = clinicService.getClinicByClinicId(clinic.getClinicId());
      if (currentClinic == null) {
          throw new IllegalArgumentException("A clinic with the name " + clinic.getClinicId() + " doesn't exist");
      }
      currentClinic.setAddress(clinic.getAddress());
      currentClinic.setDatebuilt(clinic.getDatebuilt());
      currentClinic.setClinicname(clinic.getClinicname());
      currentClinic.setHeadclinician(clinic.getHeadclinician());
      currentClinic.setIsactive(clinic.getIsactive());
      currentClinic.setParentsLimit(clinic.getParentsLimit());
      return clinicRepository.save(currentClinic);
    }


    @PostMapping("/create")
    public Clinic create(@RequestBody Clinic item) throws JsonProcessingException {
        
        if (clinicService.getClinicByClinicId(item.getClinicId()) != null) {
            throw new IllegalArgumentException("A clinic with the name " + item.getClinicname() + " already exists");
        }

        return clinicService.create(item);
    }

	@PostMapping("/createMany")
	public ArrayList<Clinic> create(@RequestBody ArrayList<Clinic> clinics) {
		Clinic clinic = null;
		
		for(Clinic s : clinics)
		{
			clinic = clinicService.create(s);
		}
		
		return clinics;
	}

	  @DeleteMapping("/delete")
	  public String delete(@RequestParam String clinicId) {
          clinicianService.findAllByAssignedClinic(clinicId)
                  .forEach(clinician -> {
                            parentService.findAllByAssignedclinician(clinician.getUserId())
                            .forEach(parent ->
                                    resultsService.deleteResultsByUserId(parent.getUserId())
                                    );
                            parentService.deleteByAssignedclinician(clinician.getUserId());
                        }
                  );
                            clinicianService.deleteAllByAssignedClinic(clinicId);
          clinicService.deleteById(clinicId);
	  	  return "Deleted " + clinicId;
	  }
	
}
