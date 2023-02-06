package edu.fiu.ffqr.dataloader;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.fiu.ffqr.models.FFQuestionnaire;
import edu.fiu.ffqr.repositories.QuestionnaireRepository;


@Component
public class DataLoader {
	
	private static final int MAX_QUESTIONNAIRES = 1000;
	
	private QuestionnaireRepository repository; 
	
	public DataLoader(QuestionnaireRepository repository) {
		this.repository = repository;
	}
	
	public void load() {
		System.out.println("Loading questionnaires...");
		try {
			
			this.repository.deleteAll();
			
			int i;
			for(i = 1; i <= MAX_QUESTIONNAIRES; i++) {
				FFQuestionnaire q = new FFQuestionnaire(("valid-" + i), ("issuer-" + i));
				this.repository.insert(q);
			}					
			System.out.println("A total of " + (i-1) + " items added to questionnaires collection.");
			
		} catch (Exception e) {
			System.err.println("An error occurred while loading questionnaires: ");
			e.printStackTrace();
		}
			
		System.out.println("...Loading complete!");
	}
	
	
}
