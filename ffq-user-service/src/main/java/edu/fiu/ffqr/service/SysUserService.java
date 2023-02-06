package edu.fiu.ffqr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.SysUser;
import edu.fiu.ffqr.repositories.SysUsersRepository;

@Service
@Component
public class SysUserService {

	@Autowired
	private SysUsersRepository sysUsersRepository;

	public List<SysUser> getAll() {
		return sysUsersRepository.findAll();
	}

	public SysUser getSysUserByUsername(String username) {
		return sysUsersRepository.findByUsername(username);
	}
	
	public SysUser create(SysUser item) {
		return sysUsersRepository.save(item);
	}
	
	
}
