package edu.fiu.ffqr;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import edu.fiu.ffqr.dataloader.DataLoader;

@SpringBootApplication
public class FFQuestionnaireApplication {

	public static void main(String[] args) throws IOException{
		ApplicationContext ctx = SpringApplication.run(FFQuestionnaireApplication.class, args);
		
		String loadDataArg = (String) ctx.getBean("loadQuestionnairesEnvVar");
		if (loadDataArg.equalsIgnoreCase("true")) {
			DataLoader loader = (DataLoader)ctx.getBean(DataLoader.class);
			loader.load();
		}

	}
	
	@Bean
	public String loadQuestionnairesEnvVar(@Value("${mongo.questionnaires.load}")String value) {
		return value;
	}
}