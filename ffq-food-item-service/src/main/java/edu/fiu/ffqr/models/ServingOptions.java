package edu.fiu.ffqr.models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ServingOptions implements Serializable {
	@JsonProperty("servingName")
	//Format amount of ounces OZ (tbs) - 2.5 OZ (5 tbps.)
	private String name;
	
	public ServingOptions() {}
	
	public ServingOptions(String name) {
		this.name = name;	
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

}
