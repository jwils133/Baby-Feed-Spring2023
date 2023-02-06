package edu.fiu.ffqr.models;

import java.io.Serializable;
import java.lang.reflect.Constructor;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

public class Children implements Serializable {
    
    @JsonProperty("name")
	private String name;
 
    @JsonProperty("childData")
    private  ArrayList<ChildData> childData;
 
    public ArrayList<ChildData> getChildData() {
        return childData;
    }

    public void setChildData(ArrayList<ChildData> childData) {
        this.childData = childData;
    }

    public Children() {
    }
 
    public Children(String name, ArrayList<ChildData> childData) {
        this.name = name;
        this.childData = childData;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }

 

    
    

}
