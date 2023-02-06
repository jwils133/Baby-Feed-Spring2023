package edu.fiu.ffqr.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.poi.util.ArrayUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import edu.fiu.ffqr.models.FoodItem;
import edu.fiu.ffqr.models.NutrientList;
import edu.fiu.ffqr.models.ValidNutrientList;
import edu.fiu.ffqr.repositories.NutrientListRepository;

@Service
@Component
public class NutrientListService {
    @Autowired
    private NutrientListRepository nutrientListRepository;

    public NutrientList getWithNutrientListID(String nutrientListID) {
        return nutrientListRepository.findByNutrientListID(nutrientListID);
    }


    //Dariana
    public NutrientList update(NutrientList updatedNutrientList) {

        return nutrientListRepository.save(updatedNutrientList);
    }

    public List<NutrientList> getAll() {
        return nutrientListRepository.findAll();
    }

    public NutrientList create(NutrientList newNutrientList) {
        //check all nutrients provided are valid
        for (String nutrient : newNutrientList.getNutrientMap().keySet()) {
            if (!Arrays.stream(ValidNutrientList.validNutrients).anyMatch(nutrient::equals)) {
                throw new IllegalArgumentException("The nutrient " + nutrient + " is not valid");
            }
        }

        //place 0.0 in nutrients not provided
        for (int i = 0; i < ValidNutrientList.validNutrients.length; i++) {
            if (newNutrientList.getNutrientMap().get(ValidNutrientList.validNutrients[i]) == null) {
                newNutrientList.getNutrientMap().put(ValidNutrientList.validNutrients[i], 0.0);
            }
        }

        return nutrientListRepository.save(newNutrientList);

    }

    public void delete(String nutrientListID) {
        NutrientList nl = nutrientListRepository.findByNutrientListID(nutrientListID);
        nutrientListRepository.delete(nl);
    }
}
