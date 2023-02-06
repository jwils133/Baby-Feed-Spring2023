package edu.fiu.ffqr.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.Participant;

@Repository
public interface ParticipantsRepository extends UserRepository<Participant> {

    List<Participant> findByAssignedResearcherInst(String assignedResearcherInst);

    void deleteAllByAssignedResearcherInst(String researcherInst);
}
