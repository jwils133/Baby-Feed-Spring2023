package edu.fiu.ffqr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fiu.ffqr.models.SysNutrientRecommendation;
import edu.fiu.ffqr.repositories.SysNutRecommendationRepository;

@Service
@Component
public class SysNutrientRecommendationService {

    @Autowired
    private SysNutRecommendationRepository sysNutRecomRepository;

    public List<SysNutrientRecommendation> getAll() {
        return sysNutRecomRepository.findAll();
    }

    public SysNutrientRecommendation getSysNutrientRecommendationByNutrientName(String name) {
        return sysNutRecomRepository.findBynutrientName(name);
    }

    public SysNutrientRecommendation create(SysNutrientRecommendation fi) {
        return sysNutRecomRepository.save(fi);
    }


}
