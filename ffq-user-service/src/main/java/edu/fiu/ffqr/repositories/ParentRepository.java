package edu.fiu.ffqr.repositories;

import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.Parent;

import java.util.List;

@Repository
public interface ParentRepository extends UserRepository<Parent> {
    List<Parent> findAllByAssignedclinician(String assignedclinician);

    void deleteAllByAssignedclinician(String assignedclinician);

    Parent findByuserId(String userId);
}

