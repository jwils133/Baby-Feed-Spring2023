package edu.fiu.ffqr.models;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FFQResult {
	@JsonProperty("weeklyTotals")
	Map<String, Double> weeklyTotals = new HashMap<String, Double>();
	@JsonProperty("dailyAverages")
	Map<String, Double> dailyAverages = new HashMap<String, Double>();
	
	public FFQResult(Map<String, Double> weeklyTotals, Map<String, Double> dailyAverages) {
		this.weeklyTotals = weeklyTotals;
		this.dailyAverages = dailyAverages;
	}

	public Map<String, Double> getWeeklyTotals() {
		return weeklyTotals;
	}

	public void setWeeklyTotals(Map<String, Double> weeklyTotals) {
		this.weeklyTotals = weeklyTotals;
	}

	public Map<String, Double> getDailyAverages() {
		return dailyAverages;
	}

	public void setDailyAverages(Map<String, Double> dailyAverages) {
		this.dailyAverages = dailyAverages;
	}
	
}
