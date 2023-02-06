package edu.fiu.ffqr.service;

import edu.fiu.ffqr.models.Clinician;
import edu.fiu.ffqr.models.User;
import edu.fiu.ffqr.repositories.UserRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.util.List;

public abstract class UserService<U extends User, A extends UserRepository<U>> {
    protected A repository;

    protected String encodePassword(String userpassword) {
        int strength = 10; // work factor of bcrypt
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(strength, new SecureRandom());
        return bCryptPasswordEncoder.encode(userpassword);
    }

    public List<U> getAll() {
        return repository.findAll();
    }

    public String getNextId() {
        return String.valueOf(
                getAll().stream().map(User::getUserId).map(Integer::parseInt).max(Integer::compare).orElse(0) + 1);
    }

    public U create(U user) {
        U updatedUser = user;
        if (user.getUserId().isEmpty()) {
            updatedUser.setUserId(this.getNextId());
        }
        if (user.getUsername().isEmpty()) {
            updatedUser.setUsername(user.getUsertype() + this.getNextId());
            updatedUser.setUserpassword(user.getUsertype() + this.getNextId());
        }
        String encodedPassword = (updatedUser.getUsertype().equals("participant")) ? updatedUser.getUserpassword()
                : encodePassword(updatedUser.getUserpassword());
        updatedUser.setUserpassword(encodedPassword);
        return this.repository.save(updatedUser);
    }

    public U getUserByUsername(String username) {
        return repository.findByUsername(username);
    }

    public U getUserByUserId(String userId) {
        return repository.getByUserId(userId);
    }

    public U getUserByUserIdNoPassword(String userId) {
        U user = repository.getByUserId(userId);
        user.setUserpassword("");
        return user;
    }

    public void delete(String username) {
        U fi = repository.getByUserId(username);
        repository.delete(fi);
    }

    public void deleteById(String userId) {
        U fi = repository.getByUserId(userId);
        repository.delete(fi);
    }

    public U update(U currentUser, U updatedUser) {
        currentUser.setUsername(updatedUser.getUsername());
        currentUser.setFirstname(updatedUser.getFirstname());
        currentUser.setLastname(updatedUser.getLastname());
        currentUser.setUsertype(updatedUser.getUsertype());
 

        currentUser.setUserpassword(
                !updatedUser.getUserpassword().trim().isEmpty() ? encodePassword(updatedUser.getUserpassword())
                        : currentUser.getUserpassword());
        return repository.save(currentUser);
    }
}
