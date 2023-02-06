package edu.fiu.ffqr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import edu.fiu.ffqr.models.SysUser;

@Repository
public interface SysUsersRepository extends MongoRepository<SysUser, String> {

    SysUser findByUsername(String username);
    
    SysUser getByUserId(String userId);
}
