package edu.fiu.ffqr.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.Researcher;

import java.util.List;

@Repository
public interface ResearcherRepository extends MongoRepository<Researcher, String> {

  Researcher getUserBy_id(ObjectId _id);

  Researcher getByUserId(String userId);
	
  Researcher findByUsername(String username);


  List<Researcher> findAllByAssignedResearchInstitutionId(String assignedResearchInstitutionId);

  void deleteAllByAssignedResearchInstitutionId(String researchInstitutionId);
}
