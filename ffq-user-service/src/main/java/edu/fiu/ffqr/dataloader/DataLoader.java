package edu.fiu.ffqr.dataloader;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.fiu.ffqr.controller.SysUserController;
import edu.fiu.ffqr.controller.AdminController;
import edu.fiu.ffqr.models.SysUser;
import edu.fiu.ffqr.models.Admin;
import edu.fiu.ffqr.repositories.SysUsersRepository;
import edu.fiu.ffqr.repositories.AdminRepository;
import edu.fiu.ffqr.controller.ClinicController;
import edu.fiu.ffqr.controller.ClinicianController;
import edu.fiu.ffqr.controller.ParentController;
import edu.fiu.ffqr.controller.ResearchController;
import edu.fiu.ffqr.controller.ParticipantsController;
import edu.fiu.ffqr.models.Clinic;
import edu.fiu.ffqr.models.Clinician;
import edu.fiu.ffqr.models.Parent;
import edu.fiu.ffqr.models.Participant;
import edu.fiu.ffqr.models.Researcher;
import edu.fiu.ffqr.models.ResearchInstitution;
import edu.fiu.ffqr.repositories.ParentRepository;
import edu.fiu.ffqr.repositories.ClinicRepository;
import edu.fiu.ffqr.repositories.ClinicianRepository;
import edu.fiu.ffqr.repositories.ResearcherRepository;
import edu.fiu.ffqr.repositories.ParticipantsRepository;
import edu.fiu.ffqr.repositories.ResearchInstitutionRepository;
import edu.fiu.ffqr.controller.ResearchInstitutionController;

@Component
public class DataLoader {

	private SysUsersRepository sysUsersRepository; // Added to test for user system
	private AdminController adminController; // Added to test for User
	private AdminRepository adminRepository;
	private SysUserController sysUserController; // Added to test for User
	private ClinicianController clinicianController; // Added to test for User
	private ClinicianRepository clinicianRepository;
	private ParentController parentController; // Added to test for User
	private ParentRepository parentRepository;
	private ClinicController clinicController; // Added to test for User
	private ClinicRepository clinicRepository;
	private ResearchController researchController;
	private ResearcherRepository researcherRepository;
	private ParticipantsController researcherParentController;
	private ParticipantsRepository researcherParentRepository;
	private ResearchInstitutionController researchInstitutionController;
	private ResearchInstitutionRepository researchInstitutionRepository;

	public DataLoader(SysUsersRepository sysUsersRepository, SysUserController sysUserController,
					  AdminController adminController, AdminRepository adminRepository, ClinicianController clinicianController,
					  ClinicianRepository clinicianRepository, ParentController parentController, ParentRepository parentRepository,
					  ClinicController clinicController, ClinicRepository clinicRepository, ResearchController researchController,
					  ResearcherRepository researcherRepository, ParticipantsController researcherParentController,
					  ParticipantsRepository researcherParentRepository, ResearchInstitutionController researchInstitutionController,
					  ResearchInstitutionRepository researchInstitutionRepository) { // Added extra parameter (SysUsersRepository
																																			// sysUsersRepository)
		this.sysUsersRepository = sysUsersRepository; // Added for users test
		this.sysUserController = sysUserController; // Added for users test
		this.adminController = adminController; // Added for users test
		this.adminRepository = adminRepository;
		this.clinicianController = clinicianController;
		this.clinicianRepository = clinicianRepository;
		this.parentController = parentController;
		this.parentRepository = parentRepository;
		this.clinicController = clinicController;
		this.clinicRepository = clinicRepository;
		this.researchController = researchController;
		this.researcherRepository = researcherRepository;
		this.researcherParentController = researcherParentController;
		this.researcherParentRepository = researcherParentRepository;
		this.researchInstitutionController = researchInstitutionController;
		this.researchInstitutionRepository = researchInstitutionRepository;

	}

	// Added whole function to load users into db (test)
	public void loadSysUsersService() {
		System.out.println("<------- Loading System Users... ------->");

		this.sysUsersRepository.deleteAll();

		try {

			String resourceName = "SysUserPayload.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<SysUser> sysUserList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				SysUser item = mapper.readValue(jsonObject.toString(), SysUser.class);
				sysUserList.add(item);
			}

			for (SysUser item : sysUserList) {
				System.out.println(item.getSysUsername() + "---- Loaded!");
				this.sysUserController.createSysUsers(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading System Food Items Recommendations: ");
			e.printStackTrace();
		}

	}

	public void loadAdmin() {
		System.out.println("<------- Loading Admin... ------->");

		this.adminRepository.deleteAll();

		try {

			String resourceName = "AdminPayload.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<Admin> userList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				Admin item = mapper.readValue(jsonObject.toString(), Admin.class);
				userList.add(item);
			}

			for (Admin item : userList) {
				System.out.println(item.getUsername() + "---- Loaded!");
				this.adminController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading System Food Items Recommendations: ");
			e.printStackTrace();
		}

	}

	public void loadClinicians() {
		System.out.println("<------- Loading Clinicians... ------->");

		this.clinicianRepository.deleteAll();

		try {

			String resourceName = "ClinicianPayLoad.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<Clinician> clinicianList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				Clinician item = mapper.readValue(jsonObject.toString(), Clinician.class);
				clinicianList.add(item);
			}

			for (Clinician item : clinicianList) {
				System.out.println(item.getUsername() + "---- Loaded!");
				this.clinicianController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading System Food Items Recommendations: ");
			e.printStackTrace();
		}

	}

	public void loadParents() {
		System.out.println("<------- Loading Parents... ------->");

		this.parentRepository.deleteAll();

		try {

			String resourceName = "ParentPayLoad.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<Parent> parentList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				Parent item = mapper.readValue(jsonObject.toString(), Parent.class);
				parentList.add(item);
			}

			for (Parent item : parentList) {
				System.out.println(item.getUsername() + "---- Loaded!");
				this.parentController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading System Food Items Recommendations: ");
			e.printStackTrace();
		}

	}

	public void loadClinics() {
		System.out.println("<------- Loading Clinics... ------->");

		this.clinicRepository.deleteAll();

		try {

			String resourceName = "ClinicPayload.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<Clinic> clinicList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				Clinic item = mapper.readValue(jsonObject.toString(), Clinic.class);
				clinicList.add(item);
			}

			for (Clinic item : clinicList) {
				System.out.println(item.getClinicname() + "---- Loaded!");
				this.clinicController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading System Food Items Recommendations: ");
			e.printStackTrace();
		}

	}

	public void loadResearch() {
		System.out.println("<------- Loading Research... ------->");

		this.researcherRepository.deleteAll();

		try {

			String resourceName = "ResearchPayload.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<Researcher> userList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				Researcher item = mapper.readValue(jsonObject.toString(), Researcher.class);
				userList.add(item);
			}

			for (Researcher item : userList) {
				System.out.println(item.getUsername() + "---- Loaded!");
				this.researchController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading Researchers: ");
			e.printStackTrace();
		}

	}

	public void loadResearchInstitution() {
		System.out.println("<------- Loading Research Institution... ------->");

		this.researchInstitutionRepository.deleteAll();

		try {

			String resourceName = "ResearchInstitutionPayload.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<ResearchInstitution> userList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				ResearchInstitution item = mapper.readValue(jsonObject.toString(), ResearchInstitution.class);
				userList.add(item);
			}

			for (ResearchInstitution item : userList) {
				System.out.println(item.GetInstitutionName() + "---- Loaded!");
				this.researchInstitutionController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading Research Institution: ");
			e.printStackTrace();
		}

	}

	public void loadResearcherParticipants() {
		System.out.println("<------- Loading Researcher Participants... ------->");

		this.researcherParentRepository.deleteAll();

		try {

			String resourceName = "ResearcherParticipantPayload.json";

			ClassLoader classLoader = getClass().getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(resourceName);
			JSONParser jsonParser = new JSONParser();
			JSONArray jsonArray = (JSONArray) jsonParser.parse(new InputStreamReader(inputStream));
			ObjectMapper mapper = new ObjectMapper();
			List<Participant> parentList = new ArrayList<>();

			for (Object object : jsonArray) {
				JSONObject jsonObject = (JSONObject) object;
				Participant item = mapper.readValue(jsonObject.toString(), Participant.class);
				parentList.add(item);
			}

			for (Participant item : parentList) {
				System.out.println(item.getUsername() + "---- Loaded!");
				this.researcherParentController.create(item);
			}
		} catch (Exception e) {
			System.err.println("An error occurred while loading Participants: ");
			e.printStackTrace();
		}

	}

	/*
	 * public void load() { System.out.println("Loading fooditems..."); try { String
	 * resourceName = "FoodItemPayload.json";
	 * 
	 * this.foodRepository.deleteAll(); this.nutrientRepository.deleteAll();
	 * ExcelDataLoad loader = new ExcelDataLoad(this.nutrientService);
	 * loader.dataLoad();
	 * 
	 * ClassLoader classLoader = getClass().getClassLoader(); InputStream
	 * inputStream = classLoader.getResourceAsStream(resourceName); JSONParser
	 * jsonParser = new JSONParser(); JSONArray jsonArray = (JSONArray) jsonParser
	 * .parse(new InputStreamReader(inputStream)); ObjectMapper mapper = new
	 * ObjectMapper(); List<FoodItem> foodList = new ArrayList<>();
	 * 
	 * for (Object object : jsonArray) { JSONObject jsonObject = (JSONObject)
	 * object; FoodItem item = mapper.readValue(jsonObject.toString(),
	 * FoodItem.class); foodList.add(item); } for(FoodItem item : foodList) {
	 * this.foodItemController.create(item); } System.out.println("A total of " +
	 * foodList.size() + " food items were added to food_items collection");
	 * 
	 * } catch (Exception e) {
	 * System.err.println("An error occurred while loading food items: ");
	 * e.printStackTrace(); }
	 * 
	 * System.out.println("...Loading complete!"); }
	 */

}
