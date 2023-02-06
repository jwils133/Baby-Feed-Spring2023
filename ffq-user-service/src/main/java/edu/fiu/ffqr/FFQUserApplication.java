package edu.fiu.ffqr;

import java.io.IOException;

import com.fasterxml.jackson.databind.JsonMappingException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import edu.fiu.ffqr.dataloader.DataLoader;

@Component
@SpringBootApplication
public class FFQUserApplication {

	public static void main(String[] args) throws JsonMappingException, IOException, InterruptedException {
		ApplicationContext ctx = SpringApplication.run(FFQUserApplication.class, args);

		// ******************************WARNING***********************//
		// This should never be run on production/staging environment or all data will
		// be lost
		// =======================================================================================
		// Only uncomment this below if you want to test locally using the predefined
		// users below.
		// This will remove ALL User Data.

		String loadDataArg = (String) ctx.getBean("loadUsersEnvVar");
		if (loadDataArg.equalsIgnoreCase("true")) {
			DataLoader loader = (DataLoader) ctx.getBean(DataLoader.class);
			/*
			 * Uncomment methods below if you need to seedthe database. Imporant: uncomment
			 * only what's needed
			 * 
			 * 
			 * 
			 */
			loader.loadAdmin();
			loader.loadClinicians();
			loader.loadParents();
			loader.loadClinics();
			loader.loadResearcherParticipants();
			loader.loadResearch();
			loader.loadResearchInstitution();
			
		}
		// ======================================================================================

	

	}

	@Bean
	public String loadUsersEnvVar(@Value("${mongo.users.load}") String value) {
		return value;
	}
}