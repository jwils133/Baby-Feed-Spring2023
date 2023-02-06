package edu.fiu.ffqr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.Admin;
import edu.fiu.ffqr.repositories.AdminRepository;

@Service
@Component
public class AdminService extends UserService<Admin, AdminRepository> {

	@Autowired
	public AdminService(AdminRepository repository) {
		this.repository = repository;
	}

}
