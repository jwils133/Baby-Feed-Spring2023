package edu.fiu.ffqr.models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SugarSetting implements Serializable {
	@JsonProperty("additionalSugar")
	private boolean hasAdditionalSugar;
	@JsonProperty("teaspoons")
	private int teaspoons;
	
	public SugarSetting()
	{
		this.hasAdditionalSugar = false;
	}
	
	public SugarSetting(int teaspoons)
	{
		this.hasAdditionalSugar = true;
		this.teaspoons = teaspoons;
	}
	
	public boolean hasAdditionalSugar() 
	{
		return hasAdditionalSugar;
	}

	public int getTeaspoons() {
		return teaspoons;
	}

	public void setTeaspoons(int teaspoons) {
		this.teaspoons = teaspoons;
	}
}
