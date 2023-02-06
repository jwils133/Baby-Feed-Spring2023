package edu.fiu.ffqr.controller;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.bson.types.ObjectId;

import edu.fiu.ffqr.models.FoodDescription;

import edu.fiu.ffqr.service.FFQFoodDescriptionService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/fooddescription")
public class FoodDescriptionController {

    @Autowired
    private FFQFoodDescriptionService foodDescriptionService;

    public FoodDescriptionController() {
    }

    @GetMapping("/all")
    public List<FoodDescription> getAllFoodDescriptions() throws JsonProcessingException {
        return foodDescriptionService.getAll();
    }

    @GetMapping("/{foodItemGroupName}")
    public FoodDescription collectionByFoodItemGroupName(@PathVariable("foodItemGroupName") String foodItemGroupName) {
        return foodDescriptionService.findByFoodItemGroupName(foodItemGroupName);
    }

    @PostMapping("/create")
    public FoodDescription createFoodDescription(@RequestBody FoodDescription foodDescription) throws JsonProcessingException {

        if (foodDescriptionService.findByFoodItemGroupName(foodDescription.getFoodItemGroupName()) != null) {
            throw new IllegalArgumentException("Food Item Description " + foodDescription.getFoodItemGroupName() + " already exists.");
        } else
            return foodDescriptionService.create(foodDescription);
    }

    @PutMapping("/update/{id}")
    public FoodDescription updateFoodDescription(@PathVariable ObjectId id, @RequestBody FoodDescription data) throws JsonProcessingException {

        FoodDescription fdItem = foodDescriptionService.findById(id);

        if (null == fdItem) {
            throw new IllegalArgumentException("The food description id does not exist");
        }

        if (data.getImageUrl() != null) {
            fdItem.setImageUrl(data.getImageUrl());
        }

        if (data.getFoodItemGroupName() != null) {
            fdItem.setFoodItemGroupName(data.getFoodItemGroupName());
        }

        if (data.getFirstBracketIntake() != null) {
            fdItem.setFirstBracketIntake(data.getFirstBracketIntake());
        }

        if (data.getSecondBracketIntake() != null) {
            fdItem.setSecondBracketIntake(data.getSecondBracketIntake());
        }

        if (data.getThirdBracketIntake() != null) {
            fdItem.setThirdBracketIntake(data.getThirdBracketIntake());
        }

        if (data.getDescription() != null) {
            fdItem.setDescription(data.getDescription());
        }

        foodDescriptionService.update(fdItem);

        return fdItem;
    }

}