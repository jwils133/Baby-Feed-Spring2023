package edu.fiu.ffqr.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.Clinic;
import edu.fiu.ffqr.models.Clinician;

@Repository
public interface ClinicRepository extends MongoRepository<Clinic, String> {

    Clinic getClinicBy_id(ObjectId _id);

    Clinic getByClinicId(String clinicId);

    Clinic getByClinicname(String clinicname);

    Clinic getByIsactive(boolean isactive);
	
  
}