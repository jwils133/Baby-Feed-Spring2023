package edu.fiu.ffqr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.SysFoodRecommendation;
import edu.fiu.ffqr.repositories.SysFoodRecommendationRepository;

@Service
@Component
public class SysFoodItemRecommendationService {

    @Autowired
    private SysFoodRecommendationRepository sysFoodItemRecomRepository;

    public List<SysFoodRecommendation> getAll() {
        return sysFoodItemRecomRepository.findAll();
    }

    public SysFoodRecommendation getSysNutrientRecommendationByNutrientName(String categoryName) {
        return sysFoodItemRecomRepository.findBycategoryName(categoryName);
    }

    public SysFoodRecommendation create(SysFoodRecommendation fi) {
        return sysFoodItemRecomRepository.save(fi);
    }
}
