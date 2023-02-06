package edu.fiu.ffqr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.TrackerResult;
import edu.fiu.ffqr.repositories.TrackerRepository;

import org.bson.types.ObjectId;


@Service
@Component
public class TrackerResultsService {

    @Autowired
    private TrackerRepository trackerRepository;

    public List<TrackerResult> getAll() {
        return trackerRepository.findAll();
    }

    public List<TrackerResult> getResultsByUserId(String userId) {
        return trackerRepository.findByUserId(userId);
    }

    public TrackerResult findById(String id) {
        // Change String ID into an ObjectID so the tracker result repository can find the object
        ObjectId _id = new ObjectId(id);
        return trackerRepository.findBy_id(_id);
    }

    public TrackerResult create(TrackerResult results) {
        return trackerRepository.save(results);
    }

    public TrackerResult update(TrackerResult results) {
        return trackerRepository.save(results);
    }
}
