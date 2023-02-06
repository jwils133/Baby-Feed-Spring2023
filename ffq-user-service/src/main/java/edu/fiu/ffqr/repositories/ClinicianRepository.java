package edu.fiu.ffqr.repositories;

import org.springframework.stereotype.Repository;

import edu.fiu.ffqr.models.Clinician;

import java.util.List;

@Repository
public interface ClinicianRepository extends UserRepository<Clinician> {

    List<Clinician> findAllByAssignedclinic(String assignedclinic);

    void deleteAllByAssignedclinic(String assignedclinic);
}
