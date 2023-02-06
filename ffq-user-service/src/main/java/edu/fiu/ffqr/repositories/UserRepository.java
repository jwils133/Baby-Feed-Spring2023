package edu.fiu.ffqr.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface UserRepository<U> extends MongoRepository<U, String> {

    U getUserBy_id(ObjectId _id);

    U getByUserId(String userId);

    U findByUsername(String username);

}
