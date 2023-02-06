package edu.fiu.ffqr.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import edu.fiu.ffqr.models.TrackerResult;

import org.bson.types.ObjectId;



@Repository
public interface TrackerRepository extends MongoRepository<TrackerResult, String> {

	List<TrackerResult> findByUserId(String userId);

	TrackerResult findBy_id(ObjectId _id);
}
