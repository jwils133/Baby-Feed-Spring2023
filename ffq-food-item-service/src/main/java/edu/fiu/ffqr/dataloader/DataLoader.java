package edu.fiu.ffqr.dataloader;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.fiu.ffqr.controller.FoodDescriptionController;
import edu.fiu.ffqr.controller.FoodItemController;
import edu.fiu.ffqr.controller.FoodRecommendationController;
import edu.fiu.ffqr.controller.NutrientRecommendationController;
import edu.fiu.ffqr.models.FoodDescription;
import edu.fiu.ffqr.models.FoodItem;
import edu.fiu.ffqr.models.SysFoodRecommendation;
import edu.fiu.ffqr.models.SysNutrientRecommendation;
import edu.fiu.ffqr.repositories.*;
import edu.fiu.ffqr.service.NutrientListService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader {

    private FFQFoodEntryRepository foodRepository;
    private NutrientListRepository nutrientRepository;
    private SysNutRecommendationRepository sysNutRecomRepository;
    private SysFoodRecommendationRepository sysFoodItemRecomRepository;
    private NutrientListService nutrientService;
    private FoodItemController foodItemController;
    private NutrientRecommendationController sysNutRecomController;
    private FoodRecommendationController sysFoodItemRecomController;
    private FoodDescriptionController foodDescriptionController;
    private FFQFoodDescriptionRepository foodDescriptionRepository;

    public DataLoader(FFQFoodEntryRepository foodRepository,
                      NutrientListRepository nutrientRepository, NutrientListService nutrientService, FoodItemController foodController,
                      NutrientRecommendationController sysNutRecomController, SysNutRecommendationRepository sysNutRecomRepository,
                      SysFoodRecommendationRepository sysFoodItemRecomRepository, FoodRecommendationController sysFoodItemRecomController,
                      FoodDescriptionController foodDescriptionController, FFQFoodDescriptionRepository foodDescriptionRepository) {
        this.foodRepository = foodRepository;
        this.nutrientRepository = nutrientRepository;
        this.nutrientService = nutrientService;
        this.foodItemController = foodController;
        this.sysNutRecomController = sysNutRecomController;
        this.sysNutRecomRepository = sysNutRecomRepository;
        this.sysFoodItemRecomRepository = sysFoodItemRecomRepository;
        this.sysFoodItemRecomController = sysFoodItemRecomController;
        this.foodDescriptionController = foodDescriptionController;
        this.foodDescriptionRepository = foodDescriptionRepository;
    }

    // Added by Dariana Gonzalez 10/2019
    public void loadSysNutrientsRecommendations() {

        System.out.println("<------- Loading System Nutrients Recommendations... (only main 19) ------->");

        this.sysNutRecomRepository.deleteAll();

        try {

            String resourceName = "SysNutrientsRecommendationsPayload.json";

            ClassLoader classLoader = getClass().getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream(resourceName);
            JSONParser jsonParser = new JSONParser();
            JSONArray jsonArray = (JSONArray) jsonParser
                    .parse(new InputStreamReader(inputStream));
            ObjectMapper mapper = new ObjectMapper();
            List<SysNutrientRecommendation> sysNutRecomList = new ArrayList<>();

            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                SysNutrientRecommendation item = mapper.readValue(jsonObject.toString(), SysNutrientRecommendation.class);
                sysNutRecomList.add(item);
            }
            for (SysNutrientRecommendation item : sysNutRecomList) {
                System.out.println(item.getNutrientName() + "---- Loaded!");
                this.sysNutRecomController.create(item);
            }
        } catch (Exception e) {
            System.err.println("An error occurred while loading System Nutrients Recommendations: ");
            e.printStackTrace();
        }
    }

    // Added by Dariana Gonzalez 11/2019
    public void loadSysFoodItemsRecommendations() {

        System.out.println("<------- Loading System Food Items Recommendations... ------->");

        this.sysFoodItemRecomRepository.deleteAll();

        try {

            String resourceName = "SysFoodRecommendationsPayload.json";

            ClassLoader classLoader = getClass().getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream(resourceName);
            JSONParser jsonParser = new JSONParser();
            JSONArray jsonArray = (JSONArray) jsonParser
                    .parse(new InputStreamReader(inputStream));
            ObjectMapper mapper = new ObjectMapper();
            List<SysFoodRecommendation> sysFoodItemRecomList = new ArrayList<>();

            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                SysFoodRecommendation item = mapper.readValue(jsonObject.toString(), SysFoodRecommendation.class);
                sysFoodItemRecomList.add(item);
            }
            for (SysFoodRecommendation item : sysFoodItemRecomList) {
                System.out.println(item.getCategoryName() + "---- Loaded!");
                this.sysFoodItemRecomController.createSysFoodRecommendation(item);
            }
        } catch (Exception e) {
            System.err.println("An error occurred while loading System Food Items Recommendations: ");
            e.printStackTrace();
        }
    }

    public void loadFoodDescription() {

        System.out.println("<------- Loading Food Description ------->");

        this.foodDescriptionRepository.deleteAll();

        try {

            String resourceName = "FoodDescriptionPayload.json";

            ClassLoader classLoader = getClass().getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream(resourceName);
            JSONParser jsonParser = new JSONParser();
            JSONArray jsonArray = (JSONArray) jsonParser
                    .parse(new InputStreamReader(inputStream));
            ObjectMapper mapper = new ObjectMapper();
            List<FoodDescription> foodDescriptionList = new ArrayList<>();

            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                FoodDescription item = mapper.readValue(jsonObject.toString(), FoodDescription.class);
                foodDescriptionList.add(item);
            }
            for (FoodDescription item : foodDescriptionList) {
                System.out.println(item.getFoodItemGroupName() + "---- Loaded!");
                this.foodDescriptionController.createFoodDescription(item);
            }
        } catch (Exception e) {
            System.err.println("An error occurred while loading System Nutrients Recommendations: ");
            e.printStackTrace();
        }
    }

    public void load() {
        System.out.println("Loading fooditems...");
        try {
            String resourceName = "FoodItemPayload.json";

            this.foodRepository.deleteAll();
            this.nutrientRepository.deleteAll();
            ExcelDataLoad loader = new ExcelDataLoad(this.nutrientService);
            loader.dataLoad();

            ClassLoader classLoader = getClass().getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream(resourceName);
            JSONParser jsonParser = new JSONParser();
            JSONArray jsonArray = (JSONArray) jsonParser
                    .parse(new InputStreamReader(inputStream));
            ObjectMapper mapper = new ObjectMapper();
            List<FoodItem> foodList = new ArrayList<>();

            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                FoodItem item = mapper.readValue(jsonObject.toString(), FoodItem.class);
                foodList.add(item);
            }
            for (FoodItem item : foodList) {
                this.foodItemController.create(item);
            }
            System.out.println("A total of " + foodList.size() + " food items were added to food_items collection");

        } catch (Exception e) {
            System.err.println("An error occurred while loading food items: ");
            e.printStackTrace();
        }

        System.out.println("...Loading complete!");

    }

    public void loadResearchResultSample() {

        System.out.println("<------- Loading Research Result Sample ------->");

    }

}
